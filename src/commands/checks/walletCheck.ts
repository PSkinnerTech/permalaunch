#!/usr/bin/env node

import { config } from 'dotenv';
import { resolve } from 'path';
import { 
  checkWalletExists,
  checkWalletEncoded,
  getWalletAddress,
  formatSuccess,
  formatError,
  delay
} from '../../utils/index.js';
import { CheckResult } from './index.js';

// Load environment variables from .env file
const envPath = resolve(process.cwd(), '.env');
const result = config({ path: envPath });
console.log('.env file loaded:', result.parsed ? 'success' : 'failed');

if (!result.parsed) {
  console.log('Failed to load .env file. Please ensure it exists and is readable.');
}

export async function runWalletCheck(): Promise<CheckResult> {
  process.stdout.write('\n\x1b[33mCHECKING WALLET...\x1b[0m');
  await delay(2000);
  
  // Clear the "CHECKING WALLET..." line
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
  
  console.log('\n\x1b[35mCHECK WALLET:\x1b[0m');
  
  try {
    // Check if wallet.json exists
    if (!checkWalletExists()) {
      console.log(formatError('[   ] wallet.json not found'));
      return { 
        success: false, 
        message: 'wallet.json not found' 
      };
    }
    console.log(formatSuccess('[ x ] wallet.json found'));

    // Check if wallet is encoded in environment
    if (!checkWalletEncoded()) {
      console.log(formatError('[   ] DEPLOY_KEY not found or invalid in environment'));
      return {
        success: false,
        message: 'DEPLOY_KEY not found or invalid in environment'
      };
    }
    console.log(formatSuccess('[ x ] Wallet encoded properly'));

    // Get and validate wallet address
    try {
      const address = await getWalletAddress(process.env.DEPLOY_KEY!);
      console.log(formatSuccess(`[ x ] Wallet Address: ${address}`));
    } catch (error) {
      console.log(formatError('[   ] Invalid wallet address'));
      return {
        success: false,
        message: 'Failed to validate wallet address'
      };
    }

    return { 
      success: true, 
      message: 'All wallet checks passed' 
    };
  } catch (error) {
    console.error(formatError('\nError during wallet check:'), error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error during wallet check' 
    };
  }
}

export const command = 'check wallet';
export const desc = 'Validates wallet setup and configuration';
export const builder = {};

// Add detailed help text
export const help = `
Validates your wallet configuration:
- Checks if initialization has been completed
- Verifies DEPLOY_KEY format and validity
- Validates wallet address

Note: For balance checking, use the 'check balance' command instead.
`;
