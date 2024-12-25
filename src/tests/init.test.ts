import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import mockFs from 'mock-fs';
import fs from 'fs-extra';
import path from 'path';
import { initCommand } from '../commands/init.js';

describe('Init Command', () => {
  const WALLET_CONTENT = JSON.stringify({ privateKey: 'test-private-key' }, null, 2);
  const BASE64_KEY = Buffer.from(WALLET_CONTENT, 'utf-8').toString('base64');
  const EXISTING_ENV_CONTENT = 'EXISTING_VAR=some-value\nANOTHER_VAR=another-value\n';

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
      await initCommand.handler();
      const envExists = await fs.pathExists('.env');
      expect(envExists).toBe(true);
      const envContent = await fs.readFile('.env', 'utf-8');
      expect(envContent).toContain(`DEPLOY_KEY="${BASE64_KEY}"`);
    });
  });

  describe('with no wallet file', () => {
    beforeEach(() => {
      // Mock an empty directory
      mockFs({});
    });

    it('should throw an error when no wallet file is found', async () => {
      // Mock console methods to capture output
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
      
      // Execute init command and expect it to handle the error
      await initCommand.handler();

      // Verify error message
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('No Wallet Found')
      );

      // Verify .env file was not created
      const envExists = await fs.pathExists('.env');
      expect(envExists).toBe(false);

      // Clean up mock
      consoleLogSpy.mockRestore();
    });
  });

  describe('with multiple wallet files', () => {
    beforeEach(() => {
      // Mock multiple wallet files
      mockFs({
        'wallet.json': WALLET_CONTENT,
        'keyfile-123.json': WALLET_CONTENT,
        'keyfile-456.json': WALLET_CONTENT
      });
    });

    it('should warn about multiple wallet files and not create .env', async () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      
      await initCommand.handler();

      // Verify warning about multiple wallet files
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Multiple wallet files found')
      );

      // Verify .env file was not created
      const envExists = await fs.pathExists('.env');
      expect(envExists).toBe(false);

      // Clean up mocks
      consoleLogSpy.mockRestore();
      consoleWarnSpy.mockRestore();
    });
  });

  describe('with existing .env file', () => {
    beforeEach(() => {
      // Mock existing .env file and wallet.json
      mockFs({
        'wallet.json': WALLET_CONTENT,
        '.env': EXISTING_ENV_CONTENT
      });
    });

    it('should preserve existing env variables while adding DEPLOY_KEY', async () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
      
      await initCommand.handler();

      // Verify .env file exists
      const envExists = await fs.pathExists('.env');
      expect(envExists).toBe(true);

      // Read .env content and verify
      const envContent = await fs.readFile('.env', 'utf-8');
      expect(envContent).toContain('EXISTING_VAR=some-value');
      expect(envContent).toContain('ANOTHER_VAR=another-value');
      expect(envContent).toContain(`DEPLOY_KEY="${BASE64_KEY}"`);

      // Clean up mock
      consoleLogSpy.mockRestore();
    });
  });

  describe('with no .env file', () => {
    beforeEach(() => {
      // Mock only wallet.json, no .env
      mockFs({
        'wallet.json': WALLET_CONTENT
      });
    });

    it('should create new .env file with DEPLOY_KEY', async () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
      
      await initCommand.handler();

      // Verify .env file was created
      const envExists = await fs.pathExists('.env');
      expect(envExists).toBe(true);

      // Read .env content and verify
      const envContent = await fs.readFile('.env', 'utf-8');
      // Use trim() to handle any extra whitespace
      expect(envContent.trim()).toBe(`DEPLOY_KEY="${BASE64_KEY}"`);

      // Verify success message
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('DEPLOY_KEY has been set successfully in .env file')
      );

      // Clean up mock
      consoleLogSpy.mockRestore();
    });
  });

  describe('with existing DEPLOY_KEY', () => {
    const EXISTING_DEPLOY_KEY = 'existing-deploy-key-value';
    const ENV_WITH_DEPLOY_KEY = `${EXISTING_ENV_CONTENT}DEPLOY_KEY="${EXISTING_DEPLOY_KEY}"\n`;

    beforeEach(() => {
      // Mock wallet.json and .env with existing DEPLOY_KEY
      mockFs({
        'wallet.json': WALLET_CONTENT,
        '.env': ENV_WITH_DEPLOY_KEY
      });
    });

    it('should warn about existing DEPLOY_KEY and update it', async () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      
      await initCommand.handler();

      // Verify warning about existing DEPLOY_KEY
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Existing DEPLOY_KEY found')
      );

      // Verify .env file was updated
      const envContent = await fs.readFile('.env', 'utf-8');
      expect(envContent).toContain(`DEPLOY_KEY="${BASE64_KEY}"`);
      expect(envContent).not.toContain(EXISTING_DEPLOY_KEY);
      
      // Verify other variables were preserved
      expect(envContent).toContain('EXISTING_VAR=some-value');
      expect(envContent).toContain('ANOTHER_VAR=another-value');

      // Clean up mocks
      consoleLogSpy.mockRestore();
      consoleWarnSpy.mockRestore();
    });
  });
});
