import { jest } from '@jest/globals';

// Set longer timeout for integration tests
jest.setTimeout(30000); // 30 seconds

// Add proper mock cleanup
beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  jest.restoreAllMocks();
});
