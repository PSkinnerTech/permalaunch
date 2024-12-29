import { jest, describe, expect, test, beforeEach, afterAll } from '@jest/globals';
import { validateEnvironmentVariables, validateWalletFile, sanitizeUserInput, hashSensitiveData } from '../utils/security.js';

// Mock fs module
jest.mock('fs', () => ({
  default: {
    existsSync: jest.fn(),
    readFileSync: jest.fn(),
    statSync: jest.fn()
  }
}));

// Import fs after mocking
import fs from 'fs';

describe.skip('Security Utils', () => {
  describe('validateEnvironmentVariables', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      process.env = { ...originalEnv };
    });

    afterAll(() => {
      process.env = originalEnv;
    });

    test('throws error when DEPLOY_KEY is missing', () => {
      delete process.env.DEPLOY_KEY;
      expect(() => validateEnvironmentVariables()).toThrow('Missing required environment variables: DEPLOY_KEY');
    });

    test('passes when DEPLOY_KEY exists', () => {
      process.env.DEPLOY_KEY = 'test-key';
      expect(() => validateEnvironmentVariables()).not.toThrow();
    });
  });

  describe('validateWalletFile', () => {
    const mockWalletPath = 'mock-wallet.json';
    
    beforeEach(() => {
      jest.clearAllMocks();
      // Reset mock defaults
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockReturnValue(Buffer.from(JSON.stringify({ invalid: 'format' })).toString('base64'));
      (fs.statSync as jest.Mock).mockReturnValue({ mode: 0o600 });
    });

    test('throws error when wallet file does not exist', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      expect(() => validateWalletFile('nonexistent.json')).toThrow('Wallet file not found');
    });

    test('throws error when wallet format is invalid', () => {
      expect(() => validateWalletFile(mockWalletPath)).toThrow('Invalid wallet format');
    });

    test('validates correct wallet format', () => {
      const validWallet = {
        kty: 'RSA',
        n: 'test',
        e: 'test'
      };
      (fs.readFileSync as jest.Mock).mockReturnValue(Buffer.from(JSON.stringify(validWallet)).toString('base64'));
      expect(() => validateWalletFile(mockWalletPath)).not.toThrow();
    });
  });

  describe('sanitizeUserInput', () => {
    test('removes dangerous characters', () => {
      const input = 'malicious;&|`$input';
      expect(sanitizeUserInput(input)).toBe('maliciousinput');
    });

    test('leaves safe input unchanged', () => {
      const input = 'safe-input-123';
      expect(sanitizeUserInput(input)).toBe('safe-input-123');
    });
  });

  describe('hashSensitiveData', () => {
    test('consistently hashes same input', () => {
      const input = 'sensitive-data';
      const hash1 = hashSensitiveData(input);
      const hash2 = hashSensitiveData(input);
      expect(hash1).toBe(hash2);
    });

    test('produces different hashes for different inputs', () => {
      const hash1 = hashSensitiveData('data1');
      const hash2 = hashSensitiveData('data2');
      expect(hash1).not.toBe(hash2);
    });
  });
}); 