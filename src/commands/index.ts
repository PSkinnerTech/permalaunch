import { DeployArgs } from '../types.js';
import { initializeProject } from './init.js';
import { runPrelaunchChecklist } from './checks/index.js';
import { launch } from './launch.js';
import { quickLaunch } from './quickLaunch.js';

export async function handleCommands(argv: DeployArgs): Promise<void> {
  if (argv.init) {
    await initializeProject();
    return;
  }

  if (argv['prelaunch-checklist']) {
    await runPrelaunchChecklist(argv);
    return;
  }

  if (argv['check-wallet']) {
    // Will implement wallet check handler
    return;
  }

  if (argv['check-balances']) {
    // Will implement balance check handler
    return;
  }

  if (argv['check-build']) {
    // Will implement build check handler
    return;
  }

  if (argv['check-ant']) {
    // Will implement ANT check handler
    return;
  }

  if (argv['check-git']) {
    // Will implement git check handler
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
