import { jest } from '@jest/globals';
import { runWalletCheck } from '../commands/checks/walletCheck.js';
import type { ValidationResult } from '../utils/validation.js';

// Create mock functions first
const mockValidateInitStatus = jest.fn<() => Promise<ValidationResult>>();
const mockGetWalletAddress = jest.fn<() => Promise<string>>();
const mockGetBalances = jest.fn<() => Promise<{ turboBalance: string; arBalance: string }>>();

// Mock the modules BEFORE importing the function
jest.mock('../utils/validation.js', () => ({
  validateInitStatus: () => mockValidateInitStatus()
}));

jest.mock('../utils/wallet.js', () => ({
  getWalletAddress: () => mockGetWalletAddress(),
  getBalances: () => mockGetBalances()
}));

jest.mock('../utils/display.js', () => ({
  formatError: (text: string) => text,
  formatSuccess: (text: string) => text,
  formatWarning: (text: string) => text
}));

// Mock delay separately
jest.mock('../utils/index.js', () => ({
  delay: () => Promise.resolve()
}));

describe('Wallet Check Command - Init Check', () => {
  beforeEach(() => {
    // Clear mocks and env
    jest.clearAllMocks();
    delete process.env.DEPLOY_KEY;
    
    // Mock console methods
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});

    // Mock process.stdout methods
    process.stdout.clearLine = jest.fn() as unknown as (dir: number) => boolean;
    process.stdout.cursorTo = jest.fn() as unknown as (x: number) => boolean;
    process.stdout.write = jest.fn() as unknown as (buffer: string | Uint8Array) => boolean;
  });

  it('should fail if init has not been run', async () => {
    mockValidateInitStatus.mockResolvedValue({
      isValid: false,
      message: 'Init incomplete - DEPLOY_KEY not found in environment'
    });

    const result = await runWalletCheck();
    
    expect(result.success).toBe(false);
    expect(result.message).toBe('Init incomplete - DEPLOY_KEY not found in environment');
  });

  it('should fail if wallet address is invalid', async () => {
    // Setup successful init and environment with valid base64 encoded key
    process.env.DEPLOY_KEY = Buffer.from(JSON.stringify({ privateKey: 'test-key' })).toString('base64');
    mockValidateInitStatus.mockResolvedValue({ isValid: true });
    
    // Setup failed wallet validation
    mockGetWalletAddress.mockRejectedValue(new Error('Invalid wallet format'));

    const result = await runWalletCheck();
    
    expect(result.success).toBe(false);
    expect(result.message).toBe('Failed to validate wallet address');
  });
}); 