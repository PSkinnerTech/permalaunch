import { 
  checkWalletEncoded,
  checkBuildFolder,
  getDeploymentCost,
  getBalances,
  updateAntRecord,
  getGitTags,
  formatSuccess, 
  formatError
} from '../utils/index.js';
import { DeployArgs } from '../types.js';
import { TurboFactory } from '@ardrive/turbo-sdk';
import { ArweaveSigner } from '@ar.io/sdk';
import fs from 'fs';
import path from 'path';

export async function quickLaunch(argv: DeployArgs): Promise<void> {
  try {
    // Quick validation of critical requirements
    if (!checkWalletEncoded()) {
      throw new Error('DEPLOY_KEY not configured');
    }

    const { exists, type } = checkBuildFolder(argv.deployFolder);
    if (!exists || !type) {
      throw new Error('Build folder not found');
    }

    // Parse wallet and initialize Turbo
    const wallet = JSON.parse(Buffer.from(process.env.DEPLOY_KEY!, 'base64').toString());
    const signer = new ArweaveSigner(wallet);
    const turbo = TurboFactory.authenticated({ signer });

    // Quick balance check
    const { turboBalance } = await getBalances(process.env.DEPLOY_KEY!);
    const deploymentCost = await getDeploymentCost(type);
    
    if (BigInt(turboBalance) < BigInt(deploymentCost)) {
      throw new Error('Insufficient balance for deployment');
    }

    // Prepare deployment
    console.log(formatSuccess('\nPreparing deployment...'));
    
    // Read build directory
    const files = fs.readdirSync(type);
    const manifestItems = files.map(file => ({
      path: file,
      id: '' // Will be filled during upload
    }));

    // Upload files
    console.log(formatSuccess('Uploading files...'));
    for (const item of manifestItems) {
      const filePath = path.join(type, item.path);
      const fileContent = fs.readFileSync(filePath);
      
      const uploadResult = await turbo.uploadFile({
        fileStreamFactory: () => Buffer.from(fileContent),
        fileSizeFactory: () => fileContent.length,
        dataItemOpts: {
          tags: [
            { name: 'Content-Type', value: 'text/html' },
            ...getGitTags()
          ]
        }
      });
      
      item.id = uploadResult.id;
    }

    // Create and upload manifest
    console.log(formatSuccess('Creating manifest...'));
    const manifest = {
      manifest: 'arweave/paths',
      version: '0.1.0',
      index: {
        path: 'index.html'
      },
      paths: Object.fromEntries(
        manifestItems.map(item => [item.path, { id: item.id }])
      )
    };

    const manifestContent = Buffer.from(JSON.stringify(manifest));
    const manifestResult = await turbo.uploadFile({
      fileStreamFactory: () => manifestContent,
      fileSizeFactory: () => manifestContent.length,
      dataItemOpts: {
        tags: [
          { name: 'Content-Type', value: 'application/x.arweave-manifest+json' },
          ...getGitTags()
        ]
      }
    });

    console.log(formatSuccess(`\nDeployment successful! Transaction ID: ${manifestResult.id}`));

    // Update ANT record if configured
    if (argv.antProcess && argv.undername) {
      console.log(formatSuccess('\nUpdating ANT record...'));
      await updateAntRecord(
        argv.antProcess,
        argv.undername,
        manifestResult.id,
        wallet
      );
      console.log(formatSuccess('ANT record updated successfully!'));
    }

  } catch (error) {
    console.error(formatError('\nQuick launch failed:'), error);
    process.exit(1);
  }
}
