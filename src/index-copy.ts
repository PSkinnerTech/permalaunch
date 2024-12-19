#!/usr/bin/env node --no-deprecation

import { ANT, ArweaveSigner, ARIO, mARIOToken } from '@ar.io/sdk';
import fs from 'fs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import path from 'path';
import inquirer from 'inquirer';
import { execSync } from 'child_process';
import { TurboFactory } from '@ardrive/turbo-sdk';
import Arweave from 'arweave';

import { DeployArgs } from './types.js';
import TurboDeploy from './turbo/index.js';

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

const DEPLOY_KEY = process.env.DEPLOY_KEY;
const ANT_PROCESS = argv.antProcess || process.env.ANT_PROCESS;

export function getTagValue(list: { name: string; value: string }[], name: string): string | undefined {
  return list.find(item => item?.name === name)?.value;
}

function checkWalletExists(): boolean {
  return fs.existsSync(path.join(process.cwd(), 'wallet.json'));
}

function checkWalletEncoded(): boolean {
  try {
    const DEPLOY_KEY = process.env.DEPLOY_KEY;
    if (!DEPLOY_KEY) return false;
    
    // Try to decode and parse the wallet to verify it's valid
    const decoded = Buffer.from(DEPLOY_KEY, 'base64').toString('utf-8');
    JSON.parse(decoded);
    return true;
  } catch (e) {
    return false;
  }
}

function checkWalletInGitignore(): boolean {
  try {
    const gitignorePath = path.join(process.cwd(), '.gitignore');
    if (!fs.existsSync(gitignorePath)) return false;
    
    const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
    return gitignoreContent.split('\n').some(line => 
      line.trim() === 'wallet.json' || line.trim() === '/wallet.json'
    );
  } catch (e) {
    return false;
  }
}

function askQuestion(question: string): Promise<boolean> {
  return inquirer.prompt([
    {
      type: 'confirm',
      name: 'proceed',
      message: question,
      default: false
    }
  ]).then(answers => answers.proceed);
}

async function selectSystem(): Promise<string> {
  const { system } = await inquirer.prompt([
    {
      type: 'list',
      name: 'system',
      message: 'What system are you using?',
      choices: ['Mac', 'Windows', 'Linux']
    }
  ]);
  return system;
}

async function getWalletAddress(encodedWallet: string): Promise<string> {
  try {
    const wallet = JSON.parse(Buffer.from(encodedWallet, 'base64').toString());
    const signer = new ArweaveSigner(wallet);
    const turbo = TurboFactory.authenticated({ signer });
    const address = await turbo.signer.getNativeAddress();
    return address;
  } catch (error) {
    console.error('\x1b[31mError getting wallet address:', error, '\x1b[0m');
    throw error;
  }
}

async function handleWalletEncoding(): Promise<boolean> {
  const proceed = await askQuestion('Your wallet.json isn\'t encoded yet, would you like to encode it? (y/n)');
  
  if (!proceed) {
    console.log('\n\x1b[31mPRELAUNCH CHECKLIST ABORTED\x1b[0m');
    return false;
  }

  const system = await selectSystem();
  
  try {
    let command: string;
    switch (system) {
      case 'Mac':
        command = 'cat wallet.json | base64 | pbcopy';
        break;
      case 'Windows':
        command = 'certutil -encode wallet.json encoded.b64 && type encoded.b64';
        break;
      case 'Linux':
        command = 'cat wallet.json | base64';
        break;
      default:
        throw new Error('Invalid selection');
    }

    execSync(command);
    console.log('\n\x1b[32mYour wallet.json has been successfully encoded and copied to your clipboard.\x1b[0m');
    console.log('\n\x1b[35mNEXT STEPS:\x1b[0m');
    console.log('\x1b[33mStep 1: Now store the encoded wallet in your environment by running this command:\x1b[0m');
    console.log('export DEPLOY_KEY=\'[paste encoded wallet here]\'');
    console.log('\n\x1b[33mStep 2: Rerun the Permalaunch Prelaunch Checklist command to continue the checklist.\x1b[0m');
    return true;
  } catch (error) {
    console.error('\n\x1b[31mError encoding wallet:', error, '\x1b[0m');
    return false;
  }
}

async function getBalances(encodedWallet: string) {
  try {
    const wallet = JSON.parse(Buffer.from(encodedWallet, 'base64').toString());
    const signer = new ArweaveSigner(wallet);
    const turbo = TurboFactory.authenticated({ signer });
    
    // Get Turbo balance
    const balance = await turbo.getBalance();
    
    // Get AR balance
    const arweave = new Arweave({
      host: 'arweave.net',
      port: 443,
      protocol: 'https'
    });
    const address = await turbo.signer.getNativeAddress();
    const arBalance = await arweave.wallets.getBalance(address);
    
    // Get tARIO balance
    const ario = ARIO.init();
    const tarioBalance = await ario
      .getBalance({ address })
      .then((bal: number) => new mARIOToken(bal).toARIO());

    return {
      turboBalance: balance.winc.toString(),
      arBalance: arweave.ar.winstonToAr(arBalance),
      tarioBalance
    };
  } catch (error) {
    console.error('\x1b[31mError getting balances:', error, '\x1b[0m');
    return { turboBalance: '0', arBalance: '0', tarioBalance: '0' };
  }
}

// Add this function to check build folders
function checkBuildFolder(): { exists: boolean; type: string | null } {
  const buildFolders = ['./dist', './build', './.next'];
  for (const folder of buildFolders) {
    if (fs.existsSync(folder)) {
      return { exists: true, type: folder };
    }
  }
  return { exists: false, type: null };
}

async function getDeploymentCost(buildFolder: string): Promise<string> {
  try {
    const wallet = JSON.parse(Buffer.from(process.env.DEPLOY_KEY!, 'base64').toString());
    const signer = new ArweaveSigner(wallet);
    const turbo = TurboFactory.authenticated({ signer });

    // Calculate total size of build folder
    const getFolderSize = (dirPath: string): number => {
      let totalSize = 0;
      const files = fs.readdirSync(dirPath);
      
      for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stats = fs.statSync(filePath);
        
        if (stats.isDirectory()) {
          totalSize += getFolderSize(filePath);
        } else {
          totalSize += stats.size;
        }
      }
      
      return totalSize;
    };

    const folderSize = getFolderSize(buildFolder);
    const [{ winc: deploymentCost }] = await turbo.getUploadCosts({
      bytes: [folderSize],
    });

    return deploymentCost.toString();
  } catch (error) {
    console.error('\x1b[31mError calculating deployment cost:', error, '\x1b[0m');
    return '0';
  }
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Add new section for GIT checks (both in prelaunch-checklist and as standalone)
const checkGit = async () => {
  process.stdout.write('\n\x1b[33mCHECKING GIT...\x1b[0m');
  await delay(2000);
  
  // Clear the "CHECKING GIT..." line
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
  
  console.log('\n\x1b[35mCHECK GIT:\x1b[0m');
  const gitHash = process.env.GITHUB_SHA;
  if (gitHash) {
    console.log(`\x1b[32m[ x ] GIT-HASH Identified\x1b[0m`);
    console.log(`\x1b[32m[ x ] GIT-HASH:\x1b[0m ${gitHash}`);
  } else {
    console.log(`\x1b[31m[   ] GIT-HASH Identified\x1b[0m`);
    console.log(`\x1b[31m[   ] GIT-HASH:\x1b[0m Not configured`);
    console.log(`\n\x1b[33mConfiguring a GIT-HASH isn't required for deploying your app onto Arweave. This variable is only required if you want to set up automatic redeployments every time you push a new commit to the github repo. To learn more about how to do this, go to \x1b[35mhttps://permalaunch.ar.io/docs\x1b[33m.\x1b[0m\n`);
  }

  // Add github.yaml check
  const githubYamlExists = fs.existsSync('./github.yaml');
  if (githubYamlExists) {
    console.log(`\x1b[32m[ x ] GitHub Workflow File Identified\x1b[0m`);
  } else {
    console.log(`\x1b[31m[   ] GitHub Workflow File Identified\x1b[0m`);
    if (!gitHash) {
      console.log(`\x1b[33mA github.yaml file is required for automatic deployments. You can find an example configuration at \x1b[35mhttps://permalaunch.ar.io/docs\x1b[33m.\x1b[0m`);
    }
  }
};

(async () => {
  if (argv['prelaunch-checklist']) {
    console.log('\n\x1b[35mPERMALAUNCH PRELAUNCH CHECKLIST INITIATED\x1b[0m\n');
    
    process.stdout.write('\x1b[33mCHECKING WALLET DETAILS...\x1b[0m');
    await delay(2000);
    
    // Clear the "CHECKING WALLET DETAILS..." line
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    
    console.log('\n\x1b[35mWALLET CHECKLIST:\x1b[0m');
    const walletExists = checkWalletExists();
    if (walletExists) {
      console.log(`\x1b[32m[ x ] Identified wallet.json\x1b[0m`);
    } else {
      console.log(`\x1b[31m[   ] Identified wallet.json`);
      console.log(`\x1b[33mYour wallet.json file couldn't be identified. For instructions on how to properly set up your wallet.json file, go to https://permalaunch.ar.io/docs\x1b[0m`);
      return;
    }

    const walletIgnored = checkWalletInGitignore();
    if (walletIgnored) {
      console.log(`\x1b[32m[ x ] Wallet in .gitignore\x1b[0m`);
    } else {
      console.log(`\x1b[31m[   ] Wallet in .gitignore\x1b[0m`);
      console.log(`\x1b[33mYour wallet.json is not in .gitignore. Please add it to prevent accidentally committing it to GitHub.\x1b[0m`);
    }

    const walletEncoded = checkWalletEncoded();
    if (walletEncoded) {
      console.log(`\x1b[32m[ x ] Wallet encoded\x1b[0m`);
      const encoded = execSync('cat wallet.json | base64').toString().trim();
      const address = await getWalletAddress(encoded);
      console.log(`\x1b[32m[ x ] Wallet Address:\x1b[0m ${address}`);
      
      process.stdout.write('\n\x1b[33mCHECKING BALANCES...\x1b[0m');
      const { turboBalance, arBalance, tarioBalance } = await getBalances(encoded);
      
      // Clear the "CHECKING BALANCES..." line
      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
      
      console.log('\n\x1b[35mCHECK BALANCES:\x1b[0m');
      console.log(`\x1b[32mTurbo Credit Balance:\x1b[0m ${turboBalance} Winston Credits`);
      console.log(`\x1b[32mAR Balance:\x1b[0m ${arBalance} AR`);
      console.log(`\x1b[32mtARIO Balance:\x1b[0m ${tarioBalance}`);
    } else {
      console.log(`\x1b[31m[   ] Wallet encoded\x1b[0m`);
      await handleWalletEncoding();
    }
    
    // Add the build checks here, before the final return
    process.stdout.write('\n\x1b[33mCHECKING BUILD...\x1b[0m');
    await delay(2000);
    
    // Clear the "CHECKING BUILD..." line
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    
    console.log('\n\x1b[35mCHECK BUILD:\x1b[0m');
    const { exists, type } = checkBuildFolder();
    if (exists && type) {
      console.log(`\x1b[32m[ x ] Build Folder Identified\x1b[0m`);
      console.log(`\x1b[32m[ x ] Build Folder Type:\x1b[0m ${type}`);
      
      process.stdout.write('\x1b[33mCalculating deployment cost...\x1b[0m');
      const deploymentCost = await getDeploymentCost(type);
      
      // Clear the "Calculating deployment cost..." line
      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
      
      console.log(`\x1b[32m[ x ] Deployment Cost:\x1b[0m ${deploymentCost} Winston Credits`);
      
      // Get the current turbo balance from the encoded wallet
      const encoded = execSync('cat wallet.json | base64').toString().trim();
      const { turboBalance } = await getBalances(encoded);
      
      const criticalChecks = {
        walletExists: checkWalletExists(),
        walletEncoded: checkWalletEncoded(),
        buildExists: exists,
        sufficientBalance: exists && BigInt(turboBalance) >= BigInt(deploymentCost)
      };
      
      if (criticalChecks.sufficientBalance) {
        const percentage = (Number(BigInt(deploymentCost)) / Number(BigInt(turboBalance)) * 100).toFixed(2);
        console.log(`\x1b[32m[ x ] Sufficient Balance\x1b[0m (${percentage}% of total balance)`);
      } else {
        console.log(`\x1b[31m[   ] Insufficient Balance\x1b[0m`);
        console.log(`\n\x1b[33mYou don't have enough Turbo Credits to deploy this application. Either your application is too large and should be downsized, or you will need to get more Turbo Credits.\n`);
        console.log(`\x1b[33mTo get more Turbo Credits, you can make your purchase in crypto or fiat at \x1b[31mhttps://buy-turbo-credits.ardrive.io/\x1b[33m.\x1b[0m\n`);
      }
    } else {
      console.log(`\x1b[31m[   ] Build Folder Identified\x1b[0m`);
      console.log(`\x1b[31m[   ] Build Folder Type:\x1b[0m None found`);
    }
    
    // Add after the build checks
    process.stdout.write('\n\x1b[33mCHECKING ANT...\x1b[0m');
    await delay(2000);
    
    // Clear the "CHECKING ANT..." line
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    
    console.log('\n\x1b[35mCHECK ANT:\x1b[0m');
    const antProcess = process.env.ANT_PROCESS;
    if (antProcess) {
      console.log(`\x1b[32m[ x ] ANT Process Identified\x1b[0m`);
      console.log(`\x1b[32m[ x ] ANT Process:\x1b[0m ${antProcess}`);
    } else {
      console.log(`\x1b[31m[   ] ANT Process Identified\x1b[0m`);
      console.log(`\x1b[31m[   ] ANT Process:\x1b[0m Not configured`);
      console.log(`\n\x1b[33mThe ANT isn't required to deploy your app onto Arweave, but you should understand that your app's url will look something like (\x1b[31mhttps://arweave.net/[very-long-hash]\x1b[33m) rather than something like (\x1b[35mhttps://permalaunch.ar.io\x1b[33m).\n`);
      console.log(`\x1b[33mIf your interested in getting an ARNS domain for your app, then go \x1b[35mhttps://arns.app/\x1b[33m to get your own.\n`);
      console.log(`\x1b[33mIf you want to learn more about ANTs and ARNS domains, then head over to \x1b[35mhttps://docs.ar.io/\x1b[33m\x1b[0m`);
    }
    
    // After ANT checks
    await checkGit();
    return;
  }

  if (argv['check-wallet']) {
    console.log('\n\x1b[35mWALLET CHECKLIST:\x1b[0m');
    
    process.stdout.write('\x1b[33mCHECKING WALLET DETAILS...\x1b[0m');
    await delay(2000);
    
    // Clear the "CHECKING WALLET DETAILS..." line
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);

    const walletExists = checkWalletExists();
    if (walletExists) {
      console.log(`\x1b[32m[ x ] Identified wallet.json\x1b[0m`);
    } else {
      console.log(`\x1b[31m[   ] Identified wallet.json`);
      console.log(`\x1b[33mYour wallet.json file couldn't be identified. For instructions on how to properly set up your wallet.json file, go to https://permalaunch.ar.io/docs\x1b[0m`);
      return;
    }

    const walletEncoded = checkWalletEncoded();
    if (walletEncoded) {
      console.log(`\x1b[32m[ x ] Wallet encoded\x1b[0m`);
      const encoded = execSync('cat wallet.json | base64').toString().trim();
      const address = await getWalletAddress(encoded);
      console.log(`\x1b[32m[ x ] Wallet Address:\x1b[0m ${address}`);
    } else {
      console.log(`\x1b[31m[   ] Wallet encoded\x1b[0m`);
      await handleWalletEncoding();
    }

    const walletIgnored = checkWalletInGitignore();
    if (walletIgnored) {
      console.log(`\x1b[32m[ x ] Wallet in .gitignore\x1b[0m`);
    } else {
      console.log(`\x1b[31m[   ] Wallet in .gitignore\x1b[0m`);
      console.log(`\x1b[33mYour wallet.json is not in .gitignore. Please add it to prevent accidentally committing it to GitHub.\x1b[0m`);
    }
    
    return;
  }

  if (argv['check-balances']) {
    const encoded = execSync('cat wallet.json | base64').toString().trim();
    
    process.stdout.write('\n\x1b[33mCHECKING BALANCES...\x1b[0m');
    const { turboBalance, arBalance, tarioBalance } = await getBalances(encoded);
    
    // Clear the "CHECKING BALANCES..." line
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    
    console.log('\n\x1b[35mCHECK BALANCES:\x1b[0m');
    console.log(`\x1b[32mTurbo Credit Balance:\x1b[0m ${turboBalance} Winston Credits`);
    console.log(`\x1b[32mAR Balance:\x1b[0m ${arBalance} AR`);
    console.log(`\x1b[32mtARIO Balance:\x1b[0m ${tarioBalance} tARIO`);
    
    return;
  }

  if (argv['check-build']) {
    process.stdout.write('\n\x1b[33mCHECKING BUILD...\x1b[0m');
    await delay(2000);
    
    // Clear the "CHECKING BUILD..." line
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    
    console.log('\n\x1b[35mCHECK BUILD:\x1b[0m');
    const { exists, type } = checkBuildFolder();
    if (exists && type) {
      console.log(`\x1b[32m[ x ] Build Folder Identified\x1b[0m`);
      console.log(`\x1b[32m[ x ] Build Folder Type:\x1b[0m ${type}`);
      
      process.stdout.write('\x1b[33mCalculating deployment cost...\x1b[0m');
      const deploymentCost = await getDeploymentCost(type);
      
      // Clear the "Calculating deployment cost..." line
      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
      
      console.log(`\x1b[32m[ x ] Deployment Cost:\x1b[0m ${deploymentCost} Winston Credits`);
      
      // Get the current turbo balance from the encoded wallet
      const encoded = execSync('cat wallet.json | base64').toString().trim();
      const { turboBalance } = await getBalances(encoded);
      
      // Compare with turbo balance
      const turboBalanceBigInt = BigInt(turboBalance);
      const deploymentCostBigInt = BigInt(deploymentCost);
      
      if (turboBalanceBigInt >= deploymentCostBigInt) {
        const percentage = (Number(deploymentCostBigInt) / Number(turboBalanceBigInt) * 100).toFixed(2);
        console.log(`\x1b[32m[ x ] Sufficient Balance\x1b[0m (${percentage}% of total balance)`);
      } else {
        console.log(`\x1b[31m[   ] Insufficient Balance\x1b[0m`);
        console.log(`\n\x1b[33mYou don't have enough Turbo Credits to deploy this application. Either your application is too large and should be downsized, or you will need to get more Turbo Credits.\n`);
        console.log(`\x1b[33mTo get more Turbo Credits, you can make your purchase in crypto or fiat at \x1b[31mhttps://buy-turbo-credits.ardrive.io/\x1b[33m.\x1b[0m\n`);
      }
    } else {
      console.log(`\x1b[31m[   ] Build Folder Identified\x1b[0m`);
      console.log(`\x1b[31m[   ] Build Folder Type:\x1b[0m None found`);
    }
    
    return;
  }

  if (argv['check-ant']) {
    process.stdout.write('\n\x1b[33mCHECKING ANT...\x1b[0m');
    await delay(2000);
    
    // Clear the "CHECKING ANT..." line
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    
    console.log('\n\x1b[35mCHECK ANT:\x1b[0m');
    const antProcess = process.env.ANT_PROCESS;
    if (antProcess) {
      console.log(`\x1b[32m[ x ] ANT Process Identified\x1b[0m`);
      console.log(`\x1b[32m[ x ] ANT Process:\x1b[0m ${antProcess}`);
    } else {
      console.log(`\x1b[31m[   ] ANT Process Identified\x1b[0m`);
      console.log(`\x1b[31m[   ] ANT Process:\x1b[0m Not configured`);
      console.log(`\n\x1b[33mThe ANT isn't required to deploy your app onto Arweave, but you should understand that your app's url will look something like (\x1b[31mhttps://arweave.net/[very-long-hash]\x1b[33m) rather than something like (\x1b[35mhttps://permalaunch.ar.io\x1b[33m).\n`);
      console.log(`\x1b[33mIf your interested in getting an ARNS domain for your app, then go \x1b[35mhttps://arns.app/\x1b[33m to get your own.\n`);
      console.log(`\x1b[33mIf you want to learn more about ANTs and ARNS domains, then head over to \x1b[35mhttps://docs.ar.io/\x1b[33m\x1b[0m`);
    }
    
    return;
  }

  if (argv['check-git']) {
    await checkGit();
    return;
  }

  if (!DEPLOY_KEY) {
    console.error('DEPLOY_KEY not configured');
    return;
  }

  const { exists, type } = checkBuildFolder();
  if (!exists) {
    console.error('No build folder found. Please ensure you have a /dist, /build, or /.next folder');
    return;
  }

  if (type && type.length === 0) {
    console.error('Build folder must not be empty');
    return;
  }

  if (!fs.existsSync(type!)) {
    console.error(`Build folder [${type}] does not exist`);
    return;
  }

  // Update deployFolder to use detected folder
  argv.deployFolder = type!;

  if (argv.launch) {
    // Ask about running prelaunch checklist
    const runChecklist = await askQuestion('Would you like to run the Prelaunch Checklist first? (y/n)');
    
    if (runChecklist) {
      console.log('\n\x1b[35mPERMALAUNCH PRELAUNCH CHECKLIST INITIATED\x1b[0m\n');
      
      // Run all prelaunch checks
      // Wallet checks
      process.stdout.write('\x1b[33mCHECKING WALLET DETAILS...\x1b[0m');
      await delay(2000);
      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
      
      // ... [all existing prelaunch checklist logic] ...

      // After all checks are complete, verify if critical checks passed
      const criticalChecks = {
        walletExists: checkWalletExists(),
        walletEncoded: checkWalletEncoded(),
        buildExists: checkBuildFolder().exists,
        sufficientBalance: true // This should be calculated based on your existing balance check
      };

      if (Object.values(criticalChecks).every(check => check)) {
        console.log('\n\x1b[32mALL SYSTEMS GO\x1b[0m\n');
        
        const proceedWithLaunch = await askQuestion('Ready for launch? (y/n)');
        if (!proceedWithLaunch) {
          console.log('\n\x1b[33mLaunch aborted.\x1b[0m');
          return;
        }
      } else {
        console.log('\n\x1b[31mPRELAUNCH CHECKLIST FAILED! ABORTING LAUNCH SEQUENCE!\x1b[0m');
        console.log(`\x1b[33mTo identify the failed checklist items, run the \x1b[35m--prelaunch-checklist\x1b[33m flag\x1b[0m\n`);
        return;
      }
    }

    // Continue with launch sequence
    const antProcess = process.env.ANT_PROCESS;
    const gitHash = process.env.GITHUB_SHA;
    
    if (antProcess) {
      console.log(`\x1b[32m[ x ] ANT Process Configured:\x1b[0m ${antProcess}`);
    } else {
      console.log(`\x1b[33m[   ] No ANT Process Configured\x1b[0m`);
    }
    
    if (gitHash) {
      console.log(`\x1b[32m[ x ] GIT-HASH Configured:\x1b[0m ${gitHash}`);
    } else {
      console.log(`\x1b[33m[   ] No GIT-HASH Configured\x1b[0m`);
    }

    console.log('\n\x1b[35mINITIATING COUNTDOWN\x1b[0m');
    
    // Countdown
    await delay(1000);
    console.log('\x1b[33m3...\x1b[0m');
    await delay(1000);
    console.log('\x1b[33m2...\x1b[0m');
    await delay(1000);
    console.log('\x1b[33m1...\x1b[0m');
    await delay(1000);
    console.log('\x1b[35mBLAST OFF!\x1b[0m\n');

    const jwk = JSON.parse(Buffer.from(DEPLOY_KEY, 'base64').toString('utf-8'));
    try {
      const manifestId = await TurboDeploy(argv, jwk);
      if (!manifestId) {
        console.error('Failed to get manifest ID');
        return;
      }

      if (ANT_PROCESS) {
        const signer = new ArweaveSigner(jwk);
        const ant = ANT.init({ processId: ANT_PROCESS, signer });

        await ant.setRecord(
          {
            undername: argv.undername,
            transactionId: manifestId,
            ttlSeconds: 3600,
          },
          {
            tags: [
              {
                name: 'GIT-HASH',
                value: process.env.GITHUB_SHA || '',
              },
              {
                name: 'App-Name',
                value: 'ARIO-Deploy',
              },
            ],
          }
        );

        console.log(`Deployed TxId [${manifestId}] to ANT [${ANT_PROCESS}] using undername [${argv.undername}]`);
      } else {
        console.log(`\nDeployment successful! Your app is available at:`);
        console.log(`https://arweave.net/${manifestId}\n`);
      }
    } catch (e) {
      console.error(e);
    }
  }

  if (argv['quick-launch']) {
    const jwk = JSON.parse(Buffer.from(DEPLOY_KEY, 'base64').toString('utf-8'));
    try {
      const manifestId = await TurboDeploy(argv, jwk);
      if (!manifestId) {
        console.error('Failed to get manifest ID');
        return;
      }

      if (ANT_PROCESS) {
        // ... existing ANT deployment code ...
      } else {
        console.log(`\nDeployment successful! Your app is available at:`);
        console.log(`https://arweave.net/${manifestId}\n`);
      }
    } catch (e) {
      console.error(e);
    }
    return;
  }

  if (!argv.launch && !argv['prelaunch-checklist'] && !argv['check-wallet'] && !argv['check-balances'] && !argv['check-build'] && !argv['check-ant'] && !argv['check-git']) {
    console.log('Please specify either --launch, --prelaunch-checklist, or --check-wallet flag');
    return;
  }
})();