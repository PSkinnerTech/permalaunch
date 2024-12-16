import { TurboFactory } from '@ardrive/turbo-sdk';
import fs from 'fs';
import mime from 'mime-types';
import path from 'node:path';
import { ReadableStream } from 'node:stream/web';
import os from 'node:os';

import { ArweaveManifest, DeployArgs } from '../types.js';

async function getContentType(filePath: string): Promise<string> {
  return mime.lookup(filePath) || 'application/octet-stream';
}

export default async function TurboDeploy(argv: DeployArgs, jwk: any): Promise<string | null> {
  const turbo = TurboFactory.authenticated({ privateKey: jwk });
  const deployFolder = argv.deployFolder;

  const newManifest: ArweaveManifest = {
    manifest: 'arweave/paths',
    version: '0.2.0',
    index: { path: 'index.html' },
    fallback: {},
    paths: {},
  };

  async function processFiles(dir: string): Promise<void> {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      try {
        const filePath = path.join(dir, file);
        const relativePath = path.relative(deployFolder, filePath);

        if (fs.statSync(filePath).isDirectory()) {
          await processFiles(filePath);
        } else {
          console.log(`Uploading file: ${relativePath}`);
          try {
            const fileSize = fs.statSync(filePath).size;
            const contentType = await getContentType(filePath);
            const uploadResult = await turbo.uploadFile({
              fileStreamFactory: () => fs.createReadStream(filePath),
              fileSizeFactory: () => fileSize,
              signal: AbortSignal.timeout(10_000),
              dataItemOpts: {
                tags: [
                  { name: 'Content-Type', value: contentType },
                  { name: 'App-Name', value: 'Permaweb-Deploy' },
                ],
              },
            });

            console.log(`Uploaded ${relativePath} with id:`, uploadResult.id);
            newManifest.paths[relativePath] = { id: uploadResult.id };

            if (file === '404.html') {
              newManifest.fallback.id = uploadResult.id;
            }
          } catch (err) {
            console.error(`Error uploading file ${relativePath}:`, err);
          }
        }
      } catch (err) {
        console.error('ERROR:', err);
      }
    }
  }

  async function uploadManifest(manifest: ArweaveManifest): Promise<string | null> {
    const tempFile = path.join(os.tmpdir(), `manifest-${Date.now()}.json`);
    try {
      const manifestString = JSON.stringify(manifest);
      fs.writeFileSync(tempFile, manifestString);
      
      const uploadResult = await turbo.uploadFile({
        fileStreamFactory: () => fs.createReadStream(tempFile),
        fileSizeFactory: () => Buffer.byteLength(manifestString),
        signal: AbortSignal.timeout(10_000),
        dataItemOpts: {
          tags: [
            {
              name: 'Content-Type',
              value: 'application/x.arweave-manifest+json',
            },
            {
              name: 'App-Name',
              value: 'ARIO-Deploy',
            },
          ],
        },
      });
      return uploadResult.id;
    } catch (error) {
      console.error('Error uploading manifest:', error);
      return null;
    } finally {
      if (fs.existsSync(tempFile)) {
        fs.unlinkSync(tempFile);
      }
    }
  }

  await processFiles(deployFolder);

  if (!newManifest.fallback.id && newManifest.paths['index.html']) {
    newManifest.fallback.id = newManifest.paths['index.html'].id;
  }

  const manifestId = await uploadManifest(newManifest);
  if (manifestId) {
    console.log(`Manifest uploaded with Id: ${manifestId}`);
    return manifestId;
  }
  return null;
}