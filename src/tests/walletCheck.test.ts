import { jest } from '@jest/globals';
import { runWalletCheck } from '../commands/checks/walletCheck.js';
import type { ValidationResult } from '../utils/validation.js';

// Create mock functions first
const mockValidateInitStatus = jest.fn<() => Promise<ValidationResult>>();
const mockGetWalletAddress = jest.fn<() => Promise<string>>();

// Mock the utils module
jest.mock('../utils/index.js', () => ({
  validateInitStatus: mockValidateInitStatus,
  getWalletAddress: mockGetWalletAddress,
  formatError: (text: string) => text,
  formatSuccess: (text: string) => text,
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
    // Setup
    mockValidateInitStatus.mockResolvedValue({
      isValid: false,
      message: 'Init incomplete - DEPLOY_KEY not found in environment'
    });

    // Execute
    const result = await runWalletCheck();
    
    // Assert
    expect(result.success).toBe(false);
    expect(result.message).toBe('Init incomplete - DEPLOY_KEY not found in environment');
  });

  it('should fail if wallet address is invalid', async () => {
    // Setup successful init and environment with valid base64 encoded key
    process.env.DEPLOY_KEY = Buffer.from(JSON.stringify({ privateKey: 'test-key' })).toString('base64');
    mockValidateInitStatus.mockResolvedValue({ isValid: true });
    
    // Setup failed wallet validation
    mockGetWalletAddress.mockRejectedValue(new Error('Invalid wallet format'));

    // Execute
    const result = await runWalletCheck();
    
    // Assert
    expect(result.success).toBe(false);
    expect(result.message).toBe('Failed to validate wallet address');
  });
}); 