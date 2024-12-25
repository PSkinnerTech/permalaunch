import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import mockFs from 'mock-fs';
import fs from 'fs-extra';
import path from 'path';
import { initCommand } from '../commands/init.js';

describe('Init Command', () => {
  const WALLET_CONTENT = JSON.stringify({ privateKey: 'test-private-key' }, null, 2);
  const BASE64_KEY = Buffer.from(WALLET_CONTENT, 'utf-8').toString('base64');

  afterEach(() => {
    mockFs.restore();
  });

  describe('with wallet.json', () => {
    beforeEach(() => {
      mockFs({
        'wallet.json': WALLET_CONTENT
      });
    });

    it('should create .env file with DEPLOY_KEY', async () => {
      await initCommand.handler();
      const envExists = await fs.pathExists('.env');
      expect(envExists).toBe(true);
    });
  });

  describe('with keyfile pattern', () => {
    beforeEach(() => {
      mockFs({
        'keyfile-123abc.json': WALLET_CONTENT
      });
    });

    it('should detect keyfile and create .env file with DEPLOY_KEY', async () => {
      // Debug: Log the current directory contents before the test
      console.log('Before test - Files:', await fs.readdir(process.cwd()));

      await initCommand.handler();

      // Debug: Log the current directory contents after the test
      console.log('After test - Files:', await fs.readdir(process.cwd()));
      
      const envExists = await fs.pathExists('.env');
      expect(envExists).toBe(true);

      const envContent = await fs.readFile('.env', 'utf-8');
      expect(envContent).toContain(`DEPLOY_KEY="${BASE64_KEY}"`);
    });
  });
});
