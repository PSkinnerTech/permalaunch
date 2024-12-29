import { 
  checkGitHash,
  checkGithubWorkflow,
  displayGitStatus,
  formatError,
  delay
} from '../../utils/index.js';
import { CheckResult } from './index.js';

export async function runGitCheck(): Promise<CheckResult> {
  process.stdout.write('\n\x1b[33mCHECKING GIT CONFIG...\x1b[0m');
  await delay(2000);
  
  // Clear the "CHECKING GIT CONFIG..." line
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
  
  console.log('\n\x1b[35mCHECK GIT:\x1b[0m');

  try {
    // Check Git hash
    const { exists: hashExists } = checkGitHash();
    
    // Check GitHub workflow
    const workflowExists = checkGithubWorkflow();

    // Display status (this function handles all the console.log formatting)
    displayGitStatus();

    // Git check is considered successful even if configs are missing
    // as Git integration is optional
    return {
      success: true,
      message: hashExists && workflowExists ? 
        'Git configuration complete' : 
        'Git check completed (some optional configurations missing)'
    };
  } catch (error) {
    console.error(formatError('\nError during Git check:'), error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error during Git check'
    };
  }
}
