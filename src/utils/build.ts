import fs from 'fs';
import path from 'path';
import { ArweaveSigner } from '@ar.io/sdk';
import { TurboFactory } from '@ardrive/turbo-sdk';
import { BuildInfo } from '../types.js';
import { formatError } from './display.js';

export function checkBuildFolder(customPath?: string): BuildInfo {
  const buildFolders = customPath ? 
    [customPath] : 
    ['./dist', './build', './.next'];

  for (const folder of buildFolders) {
    const fullPath = path.resolve(process.cwd(), folder);
    
    try {
      const exists = fs.existsSync(fullPath);
      
      if (exists) {
        const stats = fs.statSync(fullPath);
        if (stats.isDirectory()) {
          return { exists: true, type: folder };
        }
      }
    } catch (error: unknown) {
      continue;
    }
  }
  
  return { exists: false, type: null };
}

export function getFolderSize(dirPath: string): number {
  let totalSize = 0;
  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      totalSize += getFolderSize(filePath);
    } else {
      totalSize += stats.size;
    }
  }
  
  return totalSize;
}

export async function getDeploymentCost(buildFolder: string): Promise<string> {
  try {
    if (!process.env.DEPLOY_KEY) {
      throw new Error('DEPLOY_KEY not configured');
    }

    const wallet = JSON.parse(Buffer.from(process.env.DEPLOY_KEY, 'base64').toString());
    const signer = new ArweaveSigner(wallet);
    const turbo = TurboFactory.authenticated({ signer });

    const folderSize = getFolderSize(buildFolder);
    const [{ winc: deploymentCost }] = await turbo.getUploadCosts({
      bytes: [folderSize],
    });

    return deploymentCost.toString();
  } catch (error) {
    console.error(formatError('Error calculating deployment cost:'), error);
    return '0';
  }
}

export function validateBuildFolder(folderPath: string): boolean {
  try {
    // For Next.js builds, check for different structure
    if (folderPath === './.next') {
      return fs.existsSync(path.join(folderPath, 'server')) && 
             fs.existsSync(path.join(folderPath, 'static'));
    }

    // For traditional builds, check for index.html
    return findIndexHtml(folderPath);
  } catch (error) {
    console.error(formatError('Error validating build folder:'), error);
    return false;
  }
}

function findIndexHtml(dirPath: string): boolean {
  const files = fs.readdirSync(dirPath);
  
  // Check current directory for index.html
  if (files.includes('index.html')) {
    return true;
  }

  // Check subdirectories
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (findIndexHtml(filePath)) {
        return true;
      }
    }
  }

  return false;
}
