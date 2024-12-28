import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { runBalanceCheck } from '../commands/checks/balanceCheck.js';

interface Balances {
  turboBalance: string;
  arBalance: string;
}

// Create test wallet
const TEST_WALLET = JSON.stringify({ privateKey: 'test-key' });
const TEST_KEY = Buffer.from(TEST_WALLET).toString('base64');

// Create mock functions with implementations
const mockGetBalances = jest.fn<
  (key: string) => Promise<{ turboBalance: string; arBalance: string }>
>().mockImplementation((key: string) => {
  if (!key) throw new Error('No key provided');
  return Promise.resolve({ turboBalance: '1000000', arBalance: '1.5' });
});

const mockCheckBuildFolder = jest.fn().mockReturnValue({ exists: true, type: 'dist' });

const mockGetDeploymentCost = jest.fn<
  (type: string) => Promise<string>
>().mockImplementation((type: string) => {
  if (!type) throw new Error('No type provided');
  return Promise.resolve('500000');
});

// Mock the utilities
jest.mock('../utils/index.js', () => ({
  getBalances: (key: string) => mockGetBalances(key),
  checkBuildFolder: () => mockCheckBuildFolder(),
  getDeploymentCost: (type: string) => mockGetDeploymentCost(type),
  formatSuccess: (text: string) => text,
  formatError: (text: string) => text,
  formatWarning: (text: string) => text,
  delay: jest.fn()
}));

describe('Balance Check Command', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete process.env.DEPLOY_KEY;
    
    // Mock stdout methods
    process.stdout.write = jest.fn() as unknown as (buffer: string | Uint8Array) => boolean;
    process.stdout.clearLine = jest.fn() as unknown as (dir: number) => boolean;
    process.stdout.cursorTo = jest.fn() as unknown as (x: number) => boolean;
  });

  it('should check balances and pass when sufficient funds exist', async () => {
    process.env.DEPLOY_KEY = TEST_KEY;
    const result = await runBalanceCheck();
    expect(result.success).toBe(true);
    expect(result.message).toBe('Balance check passed');
  });

  it('should fail if DEPLOY_KEY is not configured', async () => {
    const result = await runBalanceCheck();
    expect(result.success).toBe(false);
    expect(result.message).toBe('DEPLOY_KEY environment variable not found');
  });

  it('should fail when build folder is not found', async () => {
    process.env.DEPLOY_KEY = TEST_KEY;
    const mockBalances = { turboBalance: '1000000', arBalance: '1.5' };
    
    mockGetBalances.mockResolvedValue(mockBalances);
    mockCheckBuildFolder.mockReturnValue({ exists: false, type: null });

    const result = await runBalanceCheck();

    expect(result.success).toBe(false);
    expect(result.message).toBe('No build folder found for cost estimation');
  });

  it('should fail when balance is insufficient', async () => {
    process.env.DEPLOY_KEY = TEST_KEY;
    const mockBalances = { turboBalance: '100', arBalance: '0.5' };
    const mockBuildCheck = { exists: true, type: 'dist' };
    const mockCost = '1000';

    mockGetBalances.mockResolvedValue(mockBalances);
    mockCheckBuildFolder.mockReturnValue(mockBuildCheck);
    mockGetDeploymentCost.mockResolvedValue(mockCost);

    const result = await runBalanceCheck();

    expect(result.success).toBe(false);
    expect(result.message).toBe('Insufficient balance for deployment');
  });

  it('should handle network errors gracefully', async () => {
    process.env.DEPLOY_KEY = TEST_KEY;
    const networkError = new Error('Network error');
    
    mockGetBalances.mockRejectedValue(networkError);

    const result = await runBalanceCheck();

    expect(result.success).toBe(false);
    expect(result.message).toBe('Network error');
  });

  it('should correctly compare large balance values', async () => {
    process.env.DEPLOY_KEY = TEST_KEY;
    const mockBalances = { turboBalance: '9007199254740991', arBalance: '1.5' }; // Max safe integer
    const mockBuildCheck = { exists: true, type: 'dist' };
    const mockCost = '1000000';

    mockGetBalances.mockResolvedValue(mockBalances);
    mockCheckBuildFolder.mockReturnValue(mockBuildCheck);
    mockGetDeploymentCost.mockResolvedValue(mockCost);

    const result = await runBalanceCheck();

    expect(result.success).toBe(true);
    expect(result.message).toBe('Balance check passed');
  });
});
