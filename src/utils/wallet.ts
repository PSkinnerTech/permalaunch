import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { ArweaveSigner } from '@ar.io/sdk';
import { TurboFactory } from '@ardrive/turbo-sdk';
import Arweave from 'arweave';
import inquirer from 'inquirer';
import dotenv from 'dotenv';
import { formatSuccess, formatError, formatWarning } from './display.js';

export function checkWalletExists(): boolean {
  return fs.existsSync(path.join(process.cwd(), 'wallet.json'));
}

export function checkWalletEncoded(): { isEncoded: boolean; deployKey: string | null } {
  try {
    // Load .env file if it exists
    const envPath = path.join(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      dotenv.config();
    }

    // Check all environment variables for any that start with DEPLOY_KEY
    const deployKeyVars = Object.keys(process.env)
      .filter(key => key.startsWith('DEPLOY_KEY'));

    if (deployKeyVars.length === 0) {
      return { isEncoded: false, deployKey: null };
    }

    // Try to parse each potential deploy key
    for (const key of deployKeyVars) {
      const value = process.env[key];
      if (value) {
        try {
          const decoded = Buffer.from(value, 'base64').toString();
          JSON.parse(decoded); // Validate it's valid JSON
          process.env.DEPLOY_KEY = value; // Set DEPLOY_KEY for compatibility
          return { isEncoded: true, deployKey: value };
        } catch {
          continue;
        }
      }
    }

    return { isEncoded: false, deployKey: null };
  } catch (error) {
    return { isEncoded: false, deployKey: null };
  }
}

export function checkWalletInGitignore(): boolean {
  try {
    const gitignorePath = path.join(process.cwd(), '.gitignore');
    if (!fs.existsSync(gitignorePath)) return false;
    
    const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
    return gitignoreContent.split('\n').some(line => 
      line.trim() === 'wallet.json' || line.trim() === '/wallet.json'
    );
  } catch (e) {
    return false;
  }
}

export async function getWalletAddress(encodedWallet: string): Promise<string> {
  try {
    const wallet = JSON.parse(Buffer.from(encodedWallet, 'base64').toString());
    const signer = new ArweaveSigner(wallet);
    const turbo = TurboFactory.authenticated({ signer });
    return await turbo.signer.getNativeAddress();
  } catch (error) {
    console.error(formatError('Error getting wallet address:'), error);
    throw error;
  }
}

export async function handleWalletEncoding(): Promise<boolean> {
  const proceed = await inquirer.prompt([{
    type: 'confirm',
    name: 'proceed',
    message: 'Your wallet.json isn\'t encoded yet, would you like to encode it?',
    default: false
  }]);
  
  if (!proceed.proceed) {
    console.log(formatError('\nPRELAUNCH CHECKLIST ABORTED'));
    return false;
  }

  const { system } = await inquirer.prompt([{
    type: 'list',
    name: 'system',
    message: 'What system are you using?',
    choices: ['Mac', 'Windows', 'Linux']
  }]);
  
  try {
    const commands = {
      Mac: 'cat wallet.json | base64 | pbcopy',
      Windows: 'certutil -encode wallet.json encoded.b64 && type encoded.b64',
      Linux: 'cat wallet.json | base64'
    };

    execSync(commands[system as keyof typeof commands]);
    
    console.log(formatSuccess('\nYour wallet.json has been successfully encoded and copied to your clipboard.'));
    console.log(formatWarning('\nNEXT STEPS:'));
    console.log(formatWarning('Step 1: Now store the encoded wallet in your environment by running this command:'));
    console.log('export DEPLOY_KEY=\'[paste encoded wallet here]\'');
    console.log(formatWarning('\nStep 2: Rerun the Permalaunch Prelaunch Checklist command to continue the checklist.'));
    return true;
  } catch (error) {
    console.error(formatError('\nError encoding wallet:'), error);
    return false;
  }
}

export async function getBalances(encodedWallet: string) {
  try {
    const wallet = JSON.parse(Buffer.from(encodedWallet, 'base64').toString());
    const signer = new ArweaveSigner(wallet);
    const turbo = TurboFactory.authenticated({ signer });
    
    // Get Turbo balance
    const balance = await turbo.getBalance();
    
    // Get AR balance
    const arweave = new Arweave({
      host: 'arweave.net',
      port: 443,
      protocol: 'https'
    });
    const address = await turbo.signer.getNativeAddress();
    const arBalance = await arweave.wallets.getBalance(address);
    
    return {
      turboBalance: balance.winc.toString(),
      arBalance: arweave.ar.winstonToAr(arBalance)
    };
  } catch (error) {
    console.error(formatError('Error getting balances:'), error);
    return { turboBalance: '0', arBalance: '0' };
  }
}
