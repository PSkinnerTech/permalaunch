import { jest } from '@jest/globals';
import { runBalanceCheck } from '../commands/checks/balanceCheck.js';
import type { ValidationResult } from '../utils/validation.js';

// Create mock functions
const mockValidateInitStatus = jest.fn<() => Promise<ValidationResult>>();

// Mock the modules
jest.mock('../utils/validation.js', () => ({
  validateInitStatus: () => mockValidateInitStatus()
}));

jest.mock('../utils/display.js', () => ({
  formatError: (text: string) => text,
  formatSuccess: (text: string) => text,
  formatWarning: (text: string) => text
}));

describe('Balance Check Command - Init Check', () => {
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
      message: 'DEPLOY_KEY environment variable not found'
    });

    const result = await runBalanceCheck();
    
    expect(result.success).toBe(false);
    expect(result.message).toBe('DEPLOY_KEY environment variable not found');
  });
}); 