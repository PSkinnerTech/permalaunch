// import { 
//     formatSuccess, 
//     formatError, 
//     formatHighlight,
//     formatWarning,
//     showCountdown,
//     delay
//   } from '../../utils/index.js';
//   import { 
//     runWalletCheck,
//     runBalanceCheck,
//     runBuildCheck,
//     runAntCheck,
//     runGitCheck,
//     CheckResult
//   } from './index.js';
//   import { DeployArgs, PrelaunchCheckResults } from '../../types.js';
//   import inquirer from 'inquirer';
  
//   export async function runPrelaunchChecklist(argv: DeployArgs): Promise<PrelaunchCheckResults> {
//     console.log('\n\x1b[35mPRELAUNCH CHECKLIST\x1b[0m');
//     console.log('==================');
    
//     const results: PrelaunchCheckResults = {
//       wallet: { success: false },
//       balance: { success: false },
//       build: { success: false },
//       ant: { success: false },
//       git: { success: false },
//       launchConfirmed: false
//     };
  
//     try {
//       // Run wallet check
//       results.wallet = await runWalletCheck();
//       if (!results.wallet.success) {
//         return results;
//       }
  
//       // Run balance check
//       results.balance = await runBalanceCheck();
//       if (!results.balance.success) {
//         return results;
//       }
  
//       // Run build check
//       results.build = await runBuildCheck(argv.deployFolder);
//       if (!results.build.success) {
//         return results;
//       }
  
//       // Run ANT check (optional)
//       const antProcess = argv.antProcess || process.env.ANT_PROCESS;
//       if (antProcess) {
//         console.log('\n\x1b[35mCHECK ANT:\x1b[0m');
//         results.ant = await runAntCheck(antProcess, argv.undername);
//       } else {
//         console.log('\n\x1b[35mCHECK ANT:\x1b[0m');
//         console.log(formatWarning('[   ] No ANT Process configured'));
//         console.log(formatWarning('\nThe ANT isn\'t required to deploy your app onto Arweave, but you should understand'));
//         console.log(formatWarning('that your app\'s url will look something like:'));
//         console.log(formatError('https://arweave.net/[very-long-hash]'));
//         console.log(formatWarning('rather than something like:'));
//         console.log(formatHighlight('https://your-app.ar.io'));
//         console.log(formatWarning('\nTo learn more about ANTs and get your own domain, visit:'));
//         console.log(formatHighlight('https://ar.io/docs\n'));
        
//         results.ant = { 
//           success: true, 
//           message: 'ANT check skipped - no ANT process provided' 
//         };
//       }
      
//       // Run Git check (optional)
//       results.git = await runGitCheck();
  
//       // Display final summary
//       await displaySummary(results);
  
//       // If all critical checks pass, ask about launching
//       if (results.wallet.success && results.balance.success && results.build.success) {
//         const { shouldLaunch } = await inquirer.prompt([{
//           type: 'confirm',
//           name: 'shouldLaunch',
//           message: '🚀 Would you like to launch the deployment now?',
//           default: false
//         }]);
  
//         results.launchConfirmed = shouldLaunch;
//         if (shouldLaunch) {
//           await showCountdown();
//         }
//       }
  
//       return results;
//     } catch (error) {
//       console.error(formatError('\nError during prelaunch checklist:'), error);
//       return results;
//     }
//   }
  
//   async function displaySummary(results: PrelaunchCheckResults): Promise<void> {
//     console.log('\n\x1b[35mCHECKLIST SUMMARY:\x1b[0m');
//     console.log('=================');
//     await delay(1000);
  
//     // Critical checks
//     console.log(formatHighlight('\nCRITICAL CHECKS:'));
//     console.log(formatCheckResult('Wallet Configuration', results.wallet));
//     console.log(formatCheckResult('Balance Verification', results.balance));
//     console.log(formatCheckResult('Build Validation', results.build));
  
//     // Optional checks
//     console.log(formatHighlight('\nOPTIONAL CHECKS:'));
//     console.log(formatCheckResult('ANT Configuration', results.ant));
//     console.log(formatCheckResult('Git Integration', results.git));
  
//     // Final status
//     const criticalChecksPassed = results.wallet.success && 
//                                 results.balance.success && 
//                                 results.build.success;
  
//     console.log('\n=================');
//     if (criticalChecksPassed) {
//       console.log(formatSuccess('✨ All critical checks passed! Ready for launch! ✨'));
//     } else {
//       console.log(formatError('❌ Some critical checks failed. Please resolve the issues before launching.'));
//     }
//     console.log('=================\n');
//   }
  
//   function formatCheckResult(label: string, result: CheckResult): string {
//     const status = result.success ? 
//       formatSuccess('PASSED') : 
//       formatError('FAILED');
    
//     const message = result.message ? 
//       ` - ${result.message}` : 
//       '';
  
//     return `${label}: ${status}${message}`;
//   } 