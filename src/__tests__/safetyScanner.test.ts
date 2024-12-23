import fs from 'fs';
import path from 'path';
import { scanForWalletFiles, scanForBase64Strings, scanForApiKeys } from '../utils/safetyScanner.js';

describe('Safety Scanner', () => {
  describe('scanForWalletFiles', () => {
    it('should detect wallet files', () => {
      const mockDir = path.join(__dirname, 'testdata', 'unsafe');
      const result = scanForWalletFiles(mockDir);
      expect(result).toBe(false);
    });

    it('should pass when no wallet files are found', () => {
      const mockDir = path.join(__dirname, 'testdata', 'safe');
      const result = scanForWalletFiles(mockDir);
      expect(result).toBe(true);
    });
  });

  describe('scanForBase64Strings', () => {
    it('should detect Base64 strings', () => {
      const mockDir = path.join(__dirname, 'testdata', 'unsafe');
      const result = scanForBase64Strings(mockDir);
      expect(result).toBe(false);
    });

    it('should pass when no Base64 strings are found', () => {
      const mockDir = path.join(__dirname, 'testdata', 'safe');
      const result = scanForBase64Strings(mockDir);
      expect(result).toBe(true);
    });
  });

  describe('scanForApiKeys', () => {
    it('should detect API keys', () => {
      const mockDir = path.join(__dirname, 'testdata', 'unsafe');
      const result = scanForApiKeys(mockDir);
      expect(result).toBe(false);
    });

    it('should pass when no API keys are found', () => {
      const mockDir = path.join(__dirname, 'testdata', 'safe');
      const result = scanForApiKeys(mockDir);
      expect(result).toBe(true);
    });
  });
}); 