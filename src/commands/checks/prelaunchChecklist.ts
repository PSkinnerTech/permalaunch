import { 
  formatSuccess, 
  formatError, 
  formatHighlight,
  showCountdown,
  delay
} from '../../utils/index.js';
import { 
  runWalletCheck,
  runBalanceCheck,
  runBuildCheck,
  runAntCheck,
  runGitCheck,
  CheckResult,
  PrelaunchCheckResults
} from './index.js';
import { DeployArgs } from '../../types.js';

export async function runPrelaunchChecklist(argv: DeployArgs): Promise<PrelaunchCheckResults> {
  console.log('\n\x1b[35mPRELAUNCH CHECKLIST\x1b[0m');
  console.log('==================');
  
  const results: PrelaunchCheckResults = {
    wallet: { success: false },
    balance: { success: false },
    build: { success: false },
    ant: { success: false },
    git: { success: false }
  };

  try {
    // Run wallet check
    results.wallet = await runWalletCheck();
    if (!results.wallet.success) {
      return results;
    }

    // Run balance check
    results.balance = await runBalanceCheck();
    if (!results.balance.success) {
      return results;
    }

    // Run build check
    results.build = await runBuildCheck(argv.deployFolder);
    if (!results.build.success) {
      return results;
    }

    // Run ANT check (optional)
    results.ant = await runAntCheck(argv.antProcess, argv.undername);
    
    // Run Git check (optional)
    results.git = await runGitCheck();

    // Display final summary
    await displaySummary(results);

    // If all critical checks pass, show countdown
    if (results.wallet.success && results.balance.success && results.build.success) {
      await showCountdown();
    }

    return results;
  } catch (error) {
    console.error(formatError('\nError during prelaunch checklist:'), error);
    return results;
  }
}

async function displaySummary(results: PrelaunchCheckResults): Promise<void> {
  console.log('\n\x1b[35mCHECKLIST SUMMARY:\x1b[0m');
  console.log('=================');
  await delay(1000);

  // Critical checks
  console.log(formatHighlight('\nCRITICAL CHECKS:'));
  console.log(formatCheckResult('Wallet Configuration', results.wallet));
  console.log(formatCheckResult('Balance Verification', results.balance));
  console.log(formatCheckResult('Build Validation', results.build));

  // Optional checks
  console.log(formatHighlight('\nOPTIONAL CHECKS:'));
  console.log(formatCheckResult('ANT Configuration', results.ant));
  console.log(formatCheckResult('Git Integration', results.git));

  // Final status
  const criticalChecksPassed = results.wallet.success && 
                              results.balance.success && 
                              results.build.success;

  console.log('\n=================');
  if (criticalChecksPassed) {
    console.log(formatSuccess('✨ All critical checks passed! Ready for launch! ✨'));
  } else {
    console.log(formatError('❌ Some critical checks failed. Please resolve the issues before launching.'));
  }
  console.log('=================\n');
}

function formatCheckResult(label: string, result: CheckResult): string {
  const status = result.success ? 
    formatSuccess('PASSED') : 
    formatError('FAILED');
  
  const message = result.message ? 
    ` - ${result.message}` : 
    '';

  return `${label}: ${status}${message}`;
} 