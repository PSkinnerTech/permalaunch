import { 
  checkWalletExists, 
  checkWalletEncoded, 
  checkWalletInGitignore,
  handleWalletEncoding,
  getWalletAddress,
  formatSuccess,
  formatError,
  formatWarning,
  delay
} from '../../utils/index.js';
import { CheckResult } from './index.js';

export async function runWalletCheck(): Promise<CheckResult> {
  process.stdout.write('\n\x1b[33mCHECKING WALLET...\x1b[0m');
  await delay(2000);
  
  // Clear the "CHECKING WALLET..." line
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
  
  console.log('\n\x1b[35mCHECK WALLET:\x1b[0m');
  
  try {
    // Check if wallet.json exists
    const walletExists = checkWalletExists();
    if (walletExists) {
      console.log(formatSuccess('[ x ] wallet.json found'));
    } else {
      console.log(formatError('[   ] wallet.json not found'));
      return { 
        success: false, 
        message: 'wallet.json not found in project root' 
      };
    }

    // Check if wallet is in .gitignore
    const inGitignore = checkWalletInGitignore();
    if (inGitignore) {
      console.log(formatSuccess('[ x ] wallet.json in .gitignore'));
    } else {
      console.log(formatWarning('[   ] wallet.json not in .gitignore'));
      console.log(formatWarning('\nWARNING: Your wallet.json should be in your .gitignore file to prevent accidentally committing it to your repository.'));
    }

    // Check if wallet is encoded
    const isEncoded = checkWalletEncoded();
    if (isEncoded) {
      console.log(formatSuccess('[ x ] Wallet encoded in DEPLOY_KEY'));
      
      // Get and display wallet address
      const address = await getWalletAddress(process.env.DEPLOY_KEY!);
      console.log(formatSuccess(`[ x ] Wallet Address: ${address}`));
    } else {
      console.log(formatError('[   ] Wallet not encoded in DEPLOY_KEY'));
      
      // Attempt to handle wallet encoding
      const encoded = await handleWalletEncoding();
      if (!encoded) {
        return { 
          success: false, 
          message: 'Wallet encoding process incomplete' 
        };
      }
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
