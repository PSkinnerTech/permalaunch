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
  .option('ant-process', {
    alias: 'a',
    type: 'string',
    description: 'The ANT process',
    demandOption: false,
  })
  .option('deploy-folder', {
    alias: 'd',
    type: 'string',
    description: 'Folder to deploy (defaults to checking ./dist, ./build, or ./.next in that order)',
    coerce: (arg) => {
      if (arg && arg !== './dist') return arg;
      
      const commonFolders = ['./dist', './build', './.next'];
      const existingFolder = commonFolders.find(folder => fs.existsSync(folder));
      
      return existingFolder || './dist';
    },
    default: './dist'
  })
  .option('undername', {
    alias: 'u',
    type: 'string',
    description: 'ANT undername to update.',
    default: '@',
  })
  .option('launch', {
    alias: 'l',
    type: 'boolean',
    description: 'Launch the deployment process',
    default: false
  })
  .option('prelaunch-checklist', {
    alias: 'p',
    type: 'boolean',
    description: 'Run the prelaunch checklist verification',
    default: false
  })
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

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  if (argv['prelaunch-checklist']) {
    console.log('\n\x1b[35mPERMALAUNCH PRELAUNCH CHECKLIST INITIATED\x1b[0m\n');
    
    process.stdout.write('\x1b[33mCHECKING WALLET DETAILS...\x1b[0m');
    await delay(2000);
    
    // Clear the "CHECKING WALLET DETAILS..." line
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    
    console.log('\x1b[35mWALLET CHECKLIST:\x1b[0m');
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
      console.log(`\x1b[32m[ x ] Wallet Address: ${address}\x1b[0m`);
      
      process.stdout.write('\n\x1b[33mCHECKING BALANCES...\x1b[0m');
      const { turboBalance, arBalance, tarioBalance } = await getBalances(encoded);
      
      // Clear the "CHECKING BALANCES..." line
      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
      
      console.log('\n\x1b[35mCHECK BALANCES:\x1b[0m');
      console.log(`\x1b[32mTurbo Credit Balance:\x1b[0m ${turboBalance} Winston Credits`);
      console.log(`\x1b[32mAR Balance:\x1b[0m ${arBalance} AR`);
      console.log(`\x1b[32mtARIO Balance:\x1b[0m ${tarioBalance} tARIO`);
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
    if (exists) {
      console.log(`\x1b[32m[ x ] Build Folder Identified\x1b[0m`);
      console.log(`\x1b[32m[ x ] Build Folder Type:\x1b[0m ${type}`);
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
      console.log(`\n\x1b[33mThe ANT isn't required to deploy your app onto Arweave, but you should understand that your app's url will look something like (\x1b[31mhttps://arweave.net/[very-long-hash]\x1b[33m) rather than something like \x1b[35mhttps://permalaunch.ar.io\x1b[33m.\n`);
      console.log(`\x1b[33mIf your interested in getting an ARNS domain for your app, then go \x1b[35mhttps://arns.app/\x1b[33m to get your own.\n`);
      console.log(`\x1b[33mIf you want to learn more about ANTs and ARNS domains, then head over to \x1b[35mhttps://docs.ar.io/\x1b[33m\x1b[0m`);
    }
    
    return;
  }

  if (!DEPLOY_KEY) {
    console.error('DEPLOY_KEY not configured');
    return;
  }

  if (!ANT_PROCESS) {
    console.error('ANT_PROCESS not configured');
    return;
  }

  if (argv.deployFolder.length === 0) {
    console.error('deploy folder must not be empty');
    return;
  }

  if (argv.undername.length === 0) {
    console.error('undername must not be empty');
    return;
  }

  if (!fs.existsSync(argv.deployFolder)) {
    console.error(`deploy folder [${argv.deployFolder}] does not exist`);
    return;
  }

  if (argv.launch) {
    const jwk = JSON.parse(Buffer.from(DEPLOY_KEY, 'base64').toString('utf-8'));
    try {
      const manifestId = await TurboDeploy(argv, jwk);
      if (!manifestId) {
        console.error('Failed to get manifest ID');
        return;
      }

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
    } catch (e) {
      console.error(e);
    }
  }

  if (!argv.launch && !argv['prelaunch-checklist']) {
    console.log('Please specify either --launch or --prelaunch-checklist flag');
    return;
  }
})();