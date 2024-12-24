import { runPrelaunchChecklist } from './checks/prelaunchChecklist.js';
import { runWalletCheck } from './checks/walletCheck.js';
import { runBalanceCheck } from './checks/balanceCheck.js';
import { runBuildCheck } from './checks/buildCheck.js';
import { runAntCheck } from './checks/antCheck.js';
import { runGitCheck } from './checks/gitCheck.js';
import { launch } from './launch.js';
import { quickLaunch } from './quickLaunch.js';
import { DeployArgs } from '../types.js';

export async function handleCommands(argv: DeployArgs): Promise<void> {
  if (argv['prelaunch-checklist']) {
    const results = await runPrelaunchChecklist(argv);
    if (results.launchConfirmed) {
      await launch(argv);
    }
    return;
  }

  if (argv['check-wallet']) {
    const result = await runWalletCheck();
    console.log(result);
    return;
  }

  if (argv['check-balances']) {
    const result = await runBalanceCheck();
    console.log(result);
    return;
  }

  if (argv['check-build']) {
    const result = await runBuildCheck(argv.deployFolder);
    console.log(result);
    return;
  }

  if (argv['check-ant']) {
    const result = await runAntCheck(argv.antProcess, argv.undername);
    console.log(result);
    return;
  }

  if (argv['check-git']) {
    const result = await runGitCheck();
    console.log(result);
    return;
  }

  if (argv.launch) {
    await launch(argv);
    return;
  }

  if (argv['quick-launch']) {
    await quickLaunch(argv);
    return;
  }

  console.log('Please specify either --launch, --prelaunch-checklist, or --check-* flag');
}
