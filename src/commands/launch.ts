import { 
  formatSuccess, 
  formatError,
  formatWarning,
  formatHighlight,
  delay,
  updateAntRecord,
  getGitTags,
  checkBuildFolder
} from '../utils/index.js';
import { runPrelaunchChecklist } from './checks/index.js';
import { DeployArgs } from '../types.js';
import TurboDeploy from '../turbo/index.js';

export async function launch(argv: DeployArgs): Promise<void> {
  try {
    console.log(formatHighlight('\n🚀 LAUNCHING PERMAWEB DEPLOYMENT 🚀'));
    console.log(formatHighlight('================================'));
    
    // Run prelaunch checklist
    const checkResults = await runPrelaunchChecklist(argv);
    
    // Check if all critical checks passed
    const criticalChecksPassed = 
      checkResults.wallet.success && 
      checkResults.balance.success && 
      checkResults.build.success;

    if (!criticalChecksPassed) {
      console.log(formatError('\nDeployment aborted due to failed critical checks.'));
      process.exit(1);
    }

    // Get the correct build folder
    const { exists, type } = checkBuildFolder(argv.deployFolder);
    if (!exists || !type) {
      throw new Error('Build folder not found');
    }
    argv.deployFolder = type; // Update deployFolder to use detected folder

    // Parse wallet from DEPLOY_KEY
    const wallet = JSON.parse(Buffer.from(process.env.DEPLOY_KEY!, 'base64').toString());

    // Display deployment info
    console.log(formatHighlight('\nDEPLOYMENT INFO:'));
    console.log('================');
    console.log(formatSuccess(`Build Folder: ${argv.deployFolder}`));
    if (argv.antProcess) {
      console.log(formatSuccess(`ANT Process: ${argv.antProcess}`));
      console.log(formatSuccess(`Undername: ${argv.undername || '@'}`));
    }
    
    // Deploy using Turbo
    console.log(formatHighlight('\nDEPLOYING TO ARWEAVE:'));
    console.log('====================');
    
    const manifestId = await TurboDeploy(argv, wallet);
    
    if (!manifestId) {
      throw new Error('Deployment failed - no manifest ID returned');
    }

    console.log(formatSuccess('\n✨ Deployment successful! ✨'));
    console.log(formatSuccess(`Transaction ID: ${manifestId}`));
    console.log(formatSuccess('View your deployment at:'));
    console.log(formatHighlight(`https://arweave.net/${manifestId}`));

    // Update ANT record if configured
    if (argv.antProcess && argv.undername) {
      console.log(formatHighlight('\nUPDATING ANT RECORD:'));
      console.log('===================');
      
      await updateAntRecord(
        argv.antProcess,
        argv.undername,
        manifestId,
        wallet,
        getGitTags()
      );
      
      console.log(formatSuccess('ANT record updated successfully!'));
      console.log(formatSuccess('Your deployment will be available at:'));
      const domain = argv.antProcess.includes('.') ? 
        argv.antProcess : 
        `${argv.antProcess}.ar-io.dev`;
      console.log(formatHighlight(
        `https://${argv.undername === '@' ? '' : `${argv.undername}.`}${domain}`
      ));
    }

    console.log(formatSuccess('\n🎉 Launch complete! 🎉\n'));
  } catch (error) {
    console.error(formatError('\nDeployment failed:'), error);
    process.exit(1);
  }
}
