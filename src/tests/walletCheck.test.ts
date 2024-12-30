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

  it('should verify wallet.json existence', async () => {
    mockValidateInitStatus.mockResolvedValue({ isValid: true });
    
    // Mock checkWalletExists
    jest.mock('../utils/wallet.js', () => ({
      ...(jest.requireActual('../utils/wallet.js') as object),
      checkWalletExists: () => false
    }));

    const result = await runWalletCheck();
    expect(result.success).toBe(false);
    expect(result.message).toContain('wallet.json not found');
  });

  it('should validate DEPLOY_KEY format', async () => {
    process.env.DEPLOY_KEY = 'invalid-base64';
    mockValidateInitStatus.mockResolvedValue({ isValid: true });

    const result = await runWalletCheck();
    expect(result.success).toBe(false);
    expect(result.message).toContain('Invalid DEPLOY_KEY format');
  });

  it('should check for .env file existence', async () => {
    // Mock fs.existsSync for .env
    jest.mock('fs', () => ({
      ...(jest.requireActual('fs') as object),
      existsSync: (path: string) => !path.endsWith('.env')
    }));

    mockValidateInitStatus.mockResolvedValue({ isValid: true });
    
    const result = await runWalletCheck();
    expect(result.message).toContain('.env file not found');
  });

  it('should offer to create .env file when missing', async () => {
    // Mock inquirer
    jest.mock('inquirer', () => ({
      prompt: () => Promise.resolve({ createEnv: true })
    }));

    const result = await runWalletCheck();
    expect(result.success).toBe(true);
    // Verify .env creation was attempted
  });

  it('should handle wallet encoding when DEPLOY_KEY is invalid', async () => {
    mockValidateInitStatus.mockResolvedValue({ isValid: true });
    mockGetWalletAddress.mockRejectedValue(new Error('Invalid wallet'));
    
    // Mock handleWalletEncoding
    const mockHandleWalletEncoding = jest.fn<() => Promise<boolean>>().mockResolvedValue(true);
    jest.mock('../utils/wallet.js', () => ({
      ...(jest.requireActual('../utils/wallet.js') as object),
      handleWalletEncoding: mockHandleWalletEncoding
    }));

    await runWalletCheck();
    expect(mockHandleWalletEncoding).toHaveBeenCalled();
  });
}); 