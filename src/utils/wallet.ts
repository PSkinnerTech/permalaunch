import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { ArweaveSigner } from '@ar.io/sdk';
import { TurboFactory } from '@ardrive/turbo-sdk';
import Arweave from 'arweave';
import inquirer from 'inquirer';
import { formatSuccess, formatError, formatWarning } from './display.js';

export function checkWalletExists(): boolean {
  return fs.existsSync(path.join(process.cwd(), 'wallet.json'));
}

export function checkWalletEncoded(): boolean {
  try {
    console.log('Current working directory:', process.cwd());
    console.log('Checking for wallet key in environment...');
    
    // Check for either DEPLOY_KEY or DEPLOY_KEY64
    const deployKey = process.env.DEPLOY_KEY || process.env.DEPLOY_KEY64;
    
    if (!deployKey) {
      console.log('Neither DEPLOY_KEY nor DEPLOY_KEY64 found in environment variables');
      console.log('Available environment variables:', Object.keys(process.env));
      return false;
    }
    
    console.log('Wallet key found, attempting to decode...');
    // Try to decode and parse the wallet to verify it's valid
    const decoded = Buffer.from(deployKey, 'base64').toString('utf-8');
    JSON.parse(decoded);
    console.log('Successfully decoded and validated wallet key');
    return true;
  } catch (e) {
    console.log('Error validating wallet key:', e);
    return false;
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

export async function getWalletAddress(encodedWallet?: string): Promise<string> {
  try {
    const deployKey = encodedWallet || process.env.DEPLOY_KEY || process.env.DEPLOY_KEY64;
    if (!deployKey) throw new Error('No wallet key found');
    
    const wallet = JSON.parse(Buffer.from(deployKey, 'base64').toString());
    const signer = new ArweaveSigner(wallet);
    const turbo = TurboFactory.authenticated({ signer });
    return await turbo.signer.getNativeAddress();
  } catch (error) {
    console.error(formatError('Error getting wallet address:'), error);
    throw error;
  }
}

export const handleWalletEncoding = async (): Promise<boolean> => {
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

export async function getBalances(
  encodedWallet?: string
): Promise<{ turboBalance: string; arBalance: string }> {
  try {
    const deployKey = encodedWallet || process.env.DEPLOY_KEY || process.env.DEPLOY_KEY64;
    if (!deployKey) throw new Error('No wallet key found');
    
    const wallet = JSON.parse(Buffer.from(deployKey, 'base64').toString());
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
      arBalance: arweave.ar.winstonToAr(arBalance),
    };
  } catch (error) {
    console.error(formatError('Error getting balances:'), error);
    return { turboBalance: '0', arBalance: '0' };
  }
}

const validateWalletFile = async (_filePath: string): Promise<boolean> => {
  // Implementation
  return true;
};

export { validateWalletFile as _validateWalletFile };
