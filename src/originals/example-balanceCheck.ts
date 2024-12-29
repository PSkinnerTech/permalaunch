// import { 
//     getBalances, 
//     getDeploymentCost,
//     checkBuildFolder,
//     formatSuccess, 
//     formatError, 
//     formatWarning,
//     delay
//   } from '../../utils/index.js';
//   import { CheckResult } from './index.js';
  
//   export async function runBalanceCheck(): Promise<CheckResult> {
//     process.stdout.write('\n\x1b[33mCHECKING BALANCES...\x1b[0m');
//     await delay(2000);
    
//     // Clear the "CHECKING BALANCES..." line
//     process.stdout.clearLine(0);
//     process.stdout.cursorTo(0);
    
//     console.log('\n\x1b[35mCHECK BALANCES:\x1b[0m');
  
//     try {
//       if (!process.env.DEPLOY_KEY) {
//         console.log(formatError('[   ] No DEPLOY_KEY configured'));
//         return {
//           success: false,
//           message: 'DEPLOY_KEY environment variable not found'
//         };
//       }
  
//       // Get wallet balances
//       const { turboBalance, arBalance } = await getBalances(process.env.DEPLOY_KEY);
      
//       console.log(formatSuccess(`[ x ] Turbo Balance: ${turboBalance} WINC`));
//       console.log(formatSuccess(`[ x ] AR Balance: ${arBalance} AR`));
  
//       // Check build folder to estimate deployment cost
//       const { exists, type } = checkBuildFolder();
//       if (!exists || !type) {
//         console.log(formatError('[   ] No build folder found for cost estimation'));
//         return {
//           success: false,
//           message: 'No build folder found for cost estimation'
//         };
//       }
  
//       // Get estimated deployment cost
//       const deploymentCost = await getDeploymentCost(type);
//       console.log(formatSuccess(`[ x ] Estimated Deployment Cost: ${deploymentCost} WINC`));
  
//       // Check if balance is sufficient
//       const hasEnoughBalance = BigInt(turboBalance) >= BigInt(deploymentCost);
      
//       if (hasEnoughBalance) {
//         console.log(formatSuccess('[ x ] Sufficient balance for deployment'));
//       } else {
//         console.log(formatError('[   ] Insufficient balance for deployment'));
//         console.log(formatWarning(`\nWARNING: Your current balance (${turboBalance} WINC) is less than the estimated deployment cost (${deploymentCost} WINC).`));
//         console.log(formatWarning('Please visit https://turbo.ar.io to top up your balance.'));
        
//         return {
//           success: false,
//           message: 'Insufficient balance for deployment'
//         };
//       }
  
//       return {
//         success: true,
//         message: 'Balance check passed'
//       };
//     } catch (error) {
//       console.error(formatError('\nError during balance check:'), error);
//       return {
//         success: false,
//         message: error instanceof Error ? error.message : 'Unknown error during balance check'
//       };
//     }
//   } 