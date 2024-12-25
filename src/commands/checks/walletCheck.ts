import { 
  validateInitStatus,
  getWalletAddress,
  getBalances,
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
    // Check if init has been run
    const initStatus = await validateInitStatus();
    if (!initStatus.isValid) {
      console.log(formatError(`[   ] Init check failed: ${initStatus.message}`));
      return { 
        success: false, 
        message: initStatus.message 
      };
    }
    console.log(formatSuccess('[ x ] Init check passed'));

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

    // Add balance check
    const { turboBalance, arBalance } = await getBalances(process.env.DEPLOY_KEY!);
    console.log(formatSuccess(`[ x ] WINC Balance: ${turboBalance}`));
    console.log(formatSuccess(`[ x ] AR Balance: ${arBalance}`));

    if (turboBalance === '0' && arBalance === '0') {
      console.log(formatWarning('\nWARNING: Wallet has no funds. Visit https://turbo.ar.io to get started.'));
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
