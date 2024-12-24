import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { formatSuccess, formatError, formatWarning } from '../utils/display.js';

const readDir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const WALLETS_DIR = process.cwd();
const ENV_FILE = '.env';
const GITIGNORE_FILE = '.gitignore';

/**
 * Search for wallet.json or keyfile*.json in the current directory.
 */
const findWalletFiles = async (): Promise<string[]> => {
  const files = await readDir(WALLETS_DIR);
  return files.filter(
    (file) => file === 'wallet.json' || /^keyfile.*\.json$/.test(file)
  );
};

/**
 * Base64 encode the content of the wallet file.
 * @param content - The content of the wallet file.
 * @returns The Base64 encoded string.
 */
const encodeBase64 = (content: string): string => {
  return Buffer.from(content, 'utf-8').toString('base64');
};

/**
 * Update or create the .env file with the DEPLOY_KEY.
 * @param base64Key - The Base64 encoded wallet key.
 */
const updateEnvFile = async (base64Key: string): Promise<void> => {
  const envPath = path.join(WALLETS_DIR, ENV_FILE);
  let envContent = '';

  try {
    envContent = await readFile(envPath, 'utf-8');
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw error;
    }
    // .env does not exist, will create it
  }

  const deployKeyLine = `DEPLOY_KEY="${base64Key}"`;
  const lines = envContent.split('\n').filter((line) => !line.startsWith('DEPLOY_KEY='));
  lines.push(deployKeyLine);
  const newEnvContent = lines.join('\n') + '\n';

  await writeFile(envPath, newEnvContent, { mode: 0o600 });
};

/**
 * Check if .env and wallet files are in .gitignore.
 * @param walletFile - The wallet file name.
 */
const checkGitignore = async (walletFile: string): Promise<void> => {
  const gitignorePath = path.join(WALLETS_DIR, GITIGNORE_FILE);
  let gitignoreContent = '';

  try {
    gitignoreContent = await readFile(gitignorePath, 'utf-8');
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      console.warn(formatWarning(`.gitignore file not found. Please add '${ENV_FILE}' and '${walletFile}' to .gitignore.`));
      return;
    }
    throw error;
  }

  const entries = [ENV_FILE, walletFile];
  entries.forEach((entry) => {
    if (!gitignoreContent.includes(entry)) {
      console.warn(formatWarning(`Please add '${entry}' to your .gitignore file.`));
    }
  });
};

/**
 * Initialize deployment key setup.
 */
const init = async (): Promise<void> => {
  try {
    const walletFiles = await findWalletFiles();

    if (walletFiles.length === 0) {
      console.log(
        formatWarning(
          'No Wallet Found. Please add your exported wallet file to the root of the project. Be sure to add the wallet to .gitignore immediately after.'
        )
      );
      return;
    }

    if (walletFiles.length > 1) {
      console.log(
        formatWarning(
          'Multiple wallet files found. Please ensure only one wallet file is present.'
        )
      );
      return;
    }

    const walletFile = walletFiles[0];
    const walletPath = path.join(WALLETS_DIR, walletFile);
    const walletContent = await readFile(walletPath, 'utf-8');
    const base64Key = encodeBase64(walletContent);

    await updateEnvFile(base64Key);
    await checkGitignore(walletFile);

    console.log(formatSuccess('DEPLOY_KEY has been set successfully in .env file.'));
  } catch (error) {
    console.error(
      formatError(`Initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    );
    process.exit(1);
  }
};

/**
 * Exported handler for the init command.
 */
export const initCommand = {
  command: 'init',
  describe: 'Initialize deployment key setup',
  handler: async (): Promise<void> => {
    await init();
  },
};
