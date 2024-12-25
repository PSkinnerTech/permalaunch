import { jest } from '@jest/globals';
import mockFs from 'mock-fs';
import { runWalletCheck } from '../commands/checks/walletCheck.js';
import * as utils from '../utils/index.js';

describe('Wallet Check Command', () => {
  beforeEach(() => {
    // Mock console methods
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(process.stdout, 'write').mockImplementation(() => true);
    jest.spyOn(process.stdout, 'clearLine').mockImplementation(() => true);
    jest.spyOn(process.stdout, 'cursorTo').mockImplementation(() => true);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    mockFs.restore();
  });

  it('should fail if init has not been run', async () => {
    jest.spyOn(utils, 'validateInitStatus').mockResolvedValue({
      isValid: false,
      message: 'Init not run'
    });

    const result = await runWalletCheck();
    expect(result.success).toBe(false);
    expect(result.message).toBe('Init not run');
  });

  it('should validate wallet address when init check passes', async () => {
    jest.spyOn(utils, 'validateInitStatus').mockResolvedValue({
      isValid: true
    });
    
    jest.spyOn(utils, 'getWalletAddress').mockResolvedValue('test-address');

    const result = await runWalletCheck();
    expect(result.success).toBe(true);
    expect(result.message).toBe('All wallet checks passed');
  });

  it('should fail if wallet address is invalid', async () => {
    jest.spyOn(utils, 'validateInitStatus').mockResolvedValue({
      isValid: true
    });
    
    jest.spyOn(utils, 'getWalletAddress').mockRejectedValue(new Error('Invalid address'));

    const result = await runWalletCheck();
    expect(result.success).toBe(false);
    expect(result.message).toBe('Failed to validate wallet address');
  });
}); 