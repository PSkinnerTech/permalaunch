import { 
  checkBuildFolder,
  validateBuildFolder,
  getFolderSize,
  formatSuccess, 
  formatError, 
  formatWarning,
  delay
} from '../../utils/index.js';
import { CheckResult } from './index.js';

export async function runBuildCheck(customPath?: string): Promise<CheckResult> {
  process.stdout.write('\n\x1b[33mCHECKING BUILD...\x1b[0m');
  await delay(2000);
  
  // Clear the "CHECKING BUILD..." line
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
  
  console.log('\n\x1b[35mCHECK BUILD:\x1b[0m');

  try {
    // Check for build folder
    const { exists, type } = checkBuildFolder(customPath);
    
    if (!exists || !type) {
      console.log(formatError('[   ] No build folder found'));
      console.log(formatWarning('\nPlease ensure you have built your project and have one of these folders:'));
      console.log(formatWarning('- ./dist'));
      console.log(formatWarning('- ./build'));
      console.log(formatWarning('- ./.next'));
      console.log(formatWarning('Or specify a custom build folder using --deploy-folder flag'));
      
      return {
        success: false,
        message: 'No build folder found'
      };
    }

    console.log(formatSuccess(`[ x ] Build folder found: ${type}`));

    // Validate build folder contents
    const isValid = validateBuildFolder(type);
    if (!isValid) {
      console.log(formatError('[   ] Invalid build folder structure'));
      console.log(formatWarning('\nYour build folder must contain an index.html file'));
      return {
        success: false,
        message: 'Invalid build folder structure'
      };
    }

    console.log(formatSuccess('[ x ] Valid build folder structure'));

    // Get and display folder size
    const size = getFolderSize(type);
    const sizeInMB = (size / (1024 * 1024)).toFixed(2);
    console.log(formatSuccess(`[ x ] Build folder size: ${sizeInMB} MB`));

    // Warn if size is large
    if (size > 100 * 1024 * 1024) { // 100MB
      console.log(formatWarning('\nWARNING: Your build folder is quite large. This will:'));
      console.log(formatWarning('1. Increase deployment costs'));
      console.log(formatWarning('2. Slow down the deployment process'));
      console.log(formatWarning('3. May impact application load times'));
      console.log(formatWarning('\nConsider optimizing your build if possible.'));
    }

    return {
      success: true,
      message: 'Build check passed'
    };
  } catch (error) {
    console.error(formatError('\nError during build check:'), error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error during build check'
    };
  }
}
