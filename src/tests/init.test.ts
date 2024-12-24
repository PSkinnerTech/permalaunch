import mockFs from 'mock-fs';
import fs from 'fs-extra';
import path from 'path';
import { initCommand } from '../commands/init.js';

describe('Init Command - Existing wallet.json', () => {
  const WALLETS_DIR = process.cwd();
  const ENV_FILE = '.env';
  const GITIGNORE_FILE = '.gitignore';
  const WALLET_FILE = 'wallet.json';
  const WALLET_CONTENT = JSON.stringify({ privateKey: 'test-private-key' }, null, 2);
  const BASE64_KEY = Buffer.from(WALLET_CONTENT, 'utf-8').toString('base64');

  beforeEach(() => {
    // Mock the file system
    mockFs({
      [WALLETS_DIR]: {
        [WALLET_FILE]: WALLET_CONTENT,
        // Initially, .env and .gitignore do not exist
      },
    });
  });

  afterEach(() => {
    // Restore the real file system
    mockFs.restore();
  });

  it('should detect wallet.json, encode it, update .env, and verify .gitignore', async () => {
    // Mock console methods
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Execute the init command handler
    await initCommand.handler();

    // Assertions

    // Check if .env file is created with DEPLOY_KEY
    const envPath = path.join(WALLETS_DIR, ENV_FILE);
    expect(await fs.pathExists(envPath)).toBe(true);
    const envContent = await fs.readFile(envPath, 'utf-8');
    expect(envContent).toContain(`DEPLOY_KEY="${BASE64_KEY}"`);

    // Check if .gitignore is warned to include .env and wallet.json
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining(`Please add '${ENV_FILE}' and '${WALLET_FILE}' to .gitignore`)
    );

    // Check for success message
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('DEPLOY_KEY has been set successfully in .env file.')
    );

    // Clean up mocks
    consoleLogSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });
});
