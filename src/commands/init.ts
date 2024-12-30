#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import inquirer from 'inquirer';
import { formatSuccess, formatWarning, formatError } from '../utils/display.js';
import { runPrelaunchChecklist } from './checks/prelaunchChecklist.js';
import { DeployArgs } from '../types.js';

const WALLETS_DIR = process.cwd();
const ENV_FILE = '.env';

/**
 * Search for wallet.json or keyfile*.json in the current directory.
 */
const findWalletFiles = async (): Promise<string[]> => {
  const files = await fs.readdir(WALLETS_DIR);
  return files.filter(
    (file) => file === 'wallet.json' || /^keyfile.*\.json$/.test(file)
  );
};

/**
 * Base64 encode the content of the wallet file.
 */
const encodeWalletToBase64 = async (walletPath: string): Promise<string> => {
  const walletContent = await fs.readFile(walletPath, 'utf-8');
  return Buffer.from(walletContent).toString('base64');
};

/**
 * Check and update .env file
 */
const handleEnvFile = async (base64Key: string): Promise<void> => {
  const envPath = path.join(WALLETS_DIR, ENV_FILE);
  let envExists = await fs.pathExists(envPath);
  
  if (!envExists) {
    const { createEnv } = await inquirer.prompt([{
      type: 'confirm',
      name: 'createEnv',
      message: '.env file not found. Would you like to create it?',
      default: true
    }]);

    if (!createEnv) {
      throw new Error('Cannot proceed without .env file');
    }
    
    try {
      fs.writeFileSync(envPath, '', { mode: 0o600 });
    } catch {
      console.error(formatError('Error creating .env file'));
      throw new Error('Failed to create .env file');
    }
  }

  let envContent = await fs.readFile(envPath, 'utf-8');
  const hasDeployKey = envContent.includes('DEPLOY_KEY=');

  if (hasDeployKey) {
    const { updateKey } = await inquirer.prompt([{
      type: 'confirm',
      name: 'updateKey',
      message: 'DEPLOY_KEY already exists in .env. Would you like to update it?',
      default: false
    }]);

    if (!updateKey) {
      console.log(formatSuccess('permalaunch initialized'));
      const { runChecklist } = await inquirer.prompt([{
        type: 'confirm',
        name: 'runChecklist',
        message: 'Would you like to run the prelaunch checklist?',
        default: true
      }]);

      if (runChecklist) {
        await runPrelaunchChecklist({ 'prelaunch-checklist': true } as DeployArgs);
      }
      return;
    }
  }

  const { confirmEncode } = await inquirer.prompt([{
    type: 'confirm',
    name: 'confirmEncode',
    message: 'Would you like to encode your wallet?',
    default: true
  }]);

  if (!confirmEncode) {
    return;
  }

  const deployKeyLine = `DEPLOY_KEY="${base64Key}"`;
  const lines = envContent.split('\n').filter((line) => !line.startsWith('DEPLOY_KEY='));
  lines.push(deployKeyLine);
  const newEnvContent = lines.join('\n') + '\n';

  await fs.writeFile(envPath, newEnvContent, { mode: 0o600 });
  console.log(formatSuccess('Your wallet has been encoded and stored in your .env file as DEPLOY_KEY.'));
};

/**
 * Exported handler for the init command.
 */
export const initCommand = {
  command: 'init',
  describe: 'Initialize deployment key from wallet file',
  handler: async () => {
    try {
      const walletFiles = await findWalletFiles();
      
      if (walletFiles.length === 0) {
        console.log(formatWarning(
          'No wallet file found. Please add your wallet.json or keyfile*.json to the project root.'
        ));
        return;
      }

      if (walletFiles.length > 1) {
        console.warn(formatWarning(
          'Multiple wallet files found. Please ensure only one wallet file exists in the project root.'
        ));
        return;
      }

      const walletPath = path.join(WALLETS_DIR, walletFiles[0]);
      
      try {
        // Validate wallet file format
        const walletContent = await fs.readFile(walletPath, 'utf-8');
        const parsed = JSON.parse(walletContent);
        
        // Check for JWK format (Arweave wallet)
        if (!parsed.kty || !parsed.n || !parsed.e) {
          throw new Error('Invalid wallet format - not a valid JWK');
        }
      } catch (error) {
        console.error(formatError('Invalid wallet file format'));
        return;
      }

      const base64Key = await encodeWalletToBase64(walletPath);
      await handleEnvFile(base64Key);

    } catch (error: unknown) {
      console.error(formatError('Error during initialization:'), error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }
};
