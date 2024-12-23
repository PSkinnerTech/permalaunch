#!/usr/bin/env node --no-deprecation

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { DeployArgs } from './types.js';
import { handleCommands } from './commands/index.js';

// CLI configuration
const argv = yargs(hideBin(process.argv))
  .usage('\n\x1b[35mPERMALAUNCH CLI\x1b[0m - Deploy your web apps to the permaweb with ease!\n')
  .option('ant-process', {
    alias: 'a',
    type: 'string',
    description: 'The ANT process (optional - only required for ARNS domain deployments)',
    demandOption: false,
  })
  .option('deploy-folder', {
    alias: 'd',
    type: 'string',
    description: 'Folder to deploy (defaults to checking ./dist, ./build, or ./.next in that order)',
    default: './dist'
  })
  .option('undername', {
    alias: 'u',
    type: 'string',
    description: 'ANT undername to update',
    default: '@'
  })
  .option('launch', {
    alias: 'l',
    type: 'boolean',
    description: 'Launch the deployment process',
    default: false
  })
  .option('quick-launch', {
    alias: 'q',
    type: 'boolean',
    description: 'Launch deployment process without checks or countdown',
    default: false
  })
  .option('prelaunch-checklist', {
    alias: 'p',
    type: 'boolean',
    description: 'Run the prelaunch checklist verification',
    default: false
  })
  .option('check-wallet', {
    type: 'boolean',
    description: 'Run wallet-specific checks only',
    default: false
  })
  .option('check-balances', {
    type: 'boolean',
    description: 'Run balance-specific checks only',
    default: false
  })
  .option('check-build', {
    type: 'boolean',
    description: 'Run build-specific checks only',
    default: false
  })
  .option('check-ant', {
    type: 'boolean',
    description: 'Run ANT-specific checks only',
    default: false
  })
  .option('check-git', {
    type: 'boolean',
    description: 'Run git-specific checks only',
    default: false
  })
  .option('help', {
    alias: 'h',
    type: 'boolean',
    description: 'Show help',
    default: false
  })
  .epilogue(`\nTo learn more about the \x1b[35mPermalaunch CLI\x1b[0m, visit the documentation at \x1b[35mhttps://permalaunch.ar.io/docs\x1b[0m`)
  .help()
  .alias('help', 'h')
  .parseSync() as DeployArgs;

// Environment variables
export const DEPLOY_KEY = process.env.DEPLOY_KEY;
export const ANT_PROCESS = argv.antProcess || process.env.ANT_PROCESS;

// Main execution
(async () => {
  try {
    await handleCommands(argv);
  } catch (error) {
    console.error('\x1b[31mError:', error instanceof Error ? error.message : 'Unknown error occurred', '\x1b[0m');
    process.exit(1);
  }
})();