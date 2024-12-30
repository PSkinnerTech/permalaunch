import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { initCommand } from '../commands/init.js';

describe('Init Command', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should have a handler function', () => {
    expect(initCommand.handler).toBeDefined();
  });
});
