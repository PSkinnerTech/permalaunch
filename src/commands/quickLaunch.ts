import { 
  checkWalletEncoded,
  checkBuildFolder,
  formatSuccess, 
  formatError,
  getGitTags,
  updateAntRecord
} from '../utils/index.js';
import { DeployArgs } from '../types.js';
import { TurboFactory } from '@ardrive/turbo-sdk';
import { ArweaveSigner } from '@ar.io/sdk';
import fs from 'fs';
import path from 'path';
import mime from 'mime-types';

export async function quickLaunch(argv: DeployArgs): Promise<void> {
  try {
    // Quick validation of critical requirements
    if (!process.env.DEPLOY_KEY || !checkWalletEncoded()) {
      throw new Error('DEPLOY_KEY not configured');
    }

    const { exists, type } = checkBuildFolder(argv.deployFolder);
    if (!exists || !type) {
      throw new Error('Build folder not found');
    }

    // Parse wallet and initialize Turbo
    const wallet = JSON.parse(Buffer.from(process.env.DEPLOY_KEY, 'base64').toString());
    const signer = new ArweaveSigner(wallet);
    const turbo = TurboFactory.authenticated({ signer });

    console.log(formatSuccess('\nPreparing deployment...'));
    
    const processDirectory = async (dirPath: string, baseDir: string): Promise<Array<{ path: string, id: string }>> => {
      const files = fs.readdirSync(dirPath);
      const manifestItems = [];

      for (const file of files) {
        const fullPath = path.join(dirPath, file);
        const stats = fs.statSync(fullPath);

        if (stats.isDirectory()) {
          manifestItems.push(...await processDirectory(fullPath, baseDir));
        } else {
          const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, '/');
          const fileContent = fs.readFileSync(fullPath);
          const contentType = mime.lookup(fullPath) || 'application/octet-stream';
          
          console.log(`Uploading file: ${relativePath}`);
          const uploadResult = await turbo.uploadFile({
            fileStreamFactory: () => fs.createReadStream(fullPath),
            fileSizeFactory: () => stats.size,
            dataItemOpts: {
              tags: [
                { name: 'Content-Type', value: contentType },
                ...getGitTags()
              ]
            }
          });

          manifestItems.push({ path: relativePath, id: uploadResult.id });
        }
      }

      return manifestItems;
    };

    const manifestItems = await processDirectory(type, type);

    // Create and upload manifest
    console.log(formatSuccess('Creating manifest...'));
    const manifest = {
      manifest: 'arweave/paths',
      version: '0.2.0',
      index: { path: 'index.html' },
      paths: Object.fromEntries(
        manifestItems.map(item => [item.path, { id: item.id }])
      )
    };

    const manifestContent = Buffer.from(JSON.stringify(manifest));
    const manifestResult = await turbo.uploadFile({
      fileStreamFactory: () => Buffer.from(manifestContent),
      fileSizeFactory: () => manifestContent.length,
      dataItemOpts: {
        tags: [
          { name: 'Content-Type', value: 'application/x.arweave-manifest+json' },
          ...getGitTags()
        ]
      }
    });

    console.log(formatSuccess(`\nDeployment successful! Transaction ID: ${manifestResult.id}`));
    console.log(formatSuccess(`View your deployment at: https://arweave.net/${manifestResult.id}`));

    // Update ANT record if configured
    if (argv.antProcess) {
      console.log(formatSuccess('\nUpdating ANT record...'));
      await updateAntRecord(
        argv.antProcess,
        argv.undername,
        manifestResult.id,
        wallet,
        getGitTags()
      );
      console.log(formatSuccess('ANT record updated successfully!'));
    }

  } catch (error) {
    console.error(formatError('\nQuick launch failed:'), error);
    process.exit(1);
  }
}
