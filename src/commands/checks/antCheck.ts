import { 
  checkAntProcess,
  validateAntConfig,
  getAntUrl,
  formatSuccess, 
  formatError, 
  formatWarning,
  formatHighlight,
  delay
} from '../../utils/index.js';
import { CheckResult } from './index.js';

export async function runAntCheck(antProcess?: string, undername: string = '@'): Promise<CheckResult> {
  console.log('\n\x1b[35mCHECK ANT:\x1b[0m');

  // If no ANT process provided, show the informative message
  if (!antProcess) {
    console.log(formatWarning('[   ] No ANT Process configured'));
    console.log(formatWarning('\nThe ANT isn\'t required to deploy your app onto Arweave, but you should understand'));
    console.log(formatWarning('that your app\'s url will look something like:'));
    console.log(formatError('https://arweave.net/[very-long-hash]'));
    console.log(formatWarning('rather than something like:'));
    console.log(formatHighlight('https://your-app.ar.io'));
    console.log(formatWarning('\nTo learn more about ANTs and get your own domain, visit:'));
    console.log(formatHighlight('https://ar.io/docs\n'));
    
    return {
      success: true,
      message: 'ANT check skipped - no ANT process provided'
    };
  }

  process.stdout.write('\n\x1b[33mCHECKING ANT CONFIG...\x1b[0m');
  await delay(2000);
  
  // Clear the "CHECKING ANT CONFIG..." line
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
  
  console.log('\n\x1b[35mCHECK ANT:\x1b[0m');

  try {
    // Check if ANT process is valid
    const isValidProcess = checkAntProcess(antProcess);
    if (!isValidProcess) {
      console.log(formatError('[   ] Invalid ANT process'));
      return {
        success: false,
        message: 'Invalid ANT process'
      };
    }

    console.log(formatSuccess(`[ x ] ANT process: ${antProcess}`));

    // Check if DEPLOY_KEY is configured
    if (!process.env.DEPLOY_KEY) {
      console.log(formatError('[   ] No DEPLOY_KEY configured'));
      return {
        success: false,
        message: 'DEPLOY_KEY environment variable not found'
      };
    }

    // Validate ANT configuration
    const isValid = await validateAntConfig(antProcess, undername);
    
    if (!isValid) {
      console.log(formatError('[   ] ANT validation failed'));
      console.log(formatWarning('\nPossible issues:'));
      console.log(formatWarning('1. The ANT process ID might be incorrect'));
      console.log(formatWarning('2. Your wallet might not have permission to update this ANT'));
      console.log(formatWarning('3. The undername might not be available'));
      return {
        success: false,
        message: 'ANT validation failed'
      };
    }

    console.log(formatSuccess('[ x ] ANT validation passed'));

    // Display the future URL
    const antUrl = getAntUrl(antProcess, undername);
    console.log(formatSuccess(`[ x ] Future URL: ${antUrl}`));

    return {
      success: true,
      message: 'ANT check passed'
    };
  } catch (error) {
    console.error(formatError('\nError during ANT check:'), error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error during ANT check'
    };
  }
}
