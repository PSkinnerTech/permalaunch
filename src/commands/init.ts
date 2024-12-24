import fs from 'fs';
import path from 'path';
import { formatSuccess, formatError, formatWarning } from '../utils/display.js';

export async function initializeProject(): Promise<void> {
  console.log(formatSuccess('\n🚀 Initializing Permalaunch...'));

  try {
    // Check for wallet.json
    const walletPath = path.join(process.cwd(), 'wallet.json');
    if (!fs.existsSync(walletPath)) {
      console.log(formatWarning('No wallet.json found in project root'));
      console.log(formatWarning('Please add your wallet file and run init again'));
      return;
    }

    // Read and encode wallet
    const walletContent = fs.readFileSync(walletPath, 'utf8');
    const base64Wallet = Buffer.from(walletContent).toString('base64');

    // Create or update .env file
    const envPath = path.join(process.cwd(), '.env');
    const envContent = `DEPLOY_KEY64="${base64Wallet}"\n`;
    
    fs.writeFileSync(envPath, envContent);
    console.log(formatSuccess('✓ Wallet encoded and saved to .env file'));

    console.log(formatSuccess('\n✨ Permalaunch initialized successfully! ✨\n'));
  } catch (error) {
    console.error(formatError('\nError initializing Permalaunch:'), error);
    process.exit(1);
  }
}