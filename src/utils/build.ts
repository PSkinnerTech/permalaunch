import fs from 'fs';
import path from 'path';
import { BuildInfo } from '../types.js';
import { formatError } from './display.js';

export function checkBuildFolder(customPath?: string): BuildInfo {
  const cwd = process.cwd();
  
  // If customPath is './dist' (the default), treat it as no custom path
  const isDefaultPath = customPath === './dist';
  
  const buildFolders = (!customPath || isDefaultPath) ? 
    [
      path.resolve(cwd, 'dist'),
      path.resolve(cwd, 'build'),
      path.resolve(cwd, '.next')
    ] : 
    [path.resolve(cwd, customPath)];
  
  for (const folder of buildFolders) {
    if (fs.existsSync(folder)) {
      return { exists: true, type: path.relative(cwd, folder) };
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

function getBuildSize(): number {
  const { exists, type } = checkBuildFolder();
  if (!exists || !type) return 0;
  return getFolderSize(path.resolve(process.cwd(), type));
}

export async function getDeploymentCost(_type: string): Promise<string> {
  try {
    const buildSize = getBuildSize();
    const sizeInMB = buildSize / (1024 * 1024);
    
    const baseCost = 100000000;
    const costPerMB = 50000000;
    const totalCost = baseCost + Math.ceil(sizeInMB * costPerMB);
    
    return totalCost.toString();
  } catch (error) {
    console.error(formatError('Error calculating deployment cost:'), error);
    return '0';
  }
}

export function validateBuildFolder(folderPath: string): boolean {
  try {
    // Check if folder exists
    if (!fs.existsSync(folderPath)) {
      return false;
    }

    // Check if folder is empty
    const files = fs.readdirSync(folderPath);
    if (files.length === 0) {
      return false;
    }

    // Check for index.html in root or any subdirectory
    const hasIndexHtml = findIndexHtml(folderPath);
    if (!hasIndexHtml) {
      return false;
    }

    return true;
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
