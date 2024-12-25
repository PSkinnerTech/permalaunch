import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import mockFs from 'mock-fs';
import fs from 'fs-extra';
import path from 'path';
import { initCommand } from '../commands/init.js';

describe('Init Command', () => {
  const WALLET_FILE = 'wallet.json';
  const WALLET_CONTENT = JSON.stringify({ privateKey: 'test-private-key' }, null, 2);

  beforeEach(() => {
    // Mock the file system in the current directory
    mockFs({
      [WALLET_FILE]: WALLET_CONTENT
    });
  });

  afterEach(() => {
    mockFs.restore();
  });

  it('should create .env file with DEPLOY_KEY', async () => {
    // Debug: Log the current directory contents before the test
    console.log('Before test - Current directory:', process.cwd());
    console.log('Before test - Files:', await fs.readdir(process.cwd()));

    await initCommand.handler();

    // Debug: Log the current directory contents after running the command
    console.log('After test - Current directory:', process.cwd());
    console.log('After test - Files:', await fs.readdir(process.cwd()));
    
    const envExists = await fs.pathExists('.env');
    expect(envExists).toBe(true);
  });
});
