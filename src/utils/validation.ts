import fs from 'fs';
import path from 'path';
import { formatError, formatWarning } from './display.js';

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export async function validateInitStatus(): Promise<ValidationResult> {
  // Check if .env exists
  const envPath = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) {
    return {
      isValid: false,
      message: 'Init not run - .env file not found. Please run: npx permalaunch --init'
    };
  }

  // Check if DEPLOY_KEY exists
  if (!process.env.DEPLOY_KEY) {
    return {
      isValid: false,
      message: 'Init incomplete - DEPLOY_KEY not found in environment'
    };
  }

  try {
    // Validate DEPLOY_KEY format
    const decoded = Buffer.from(process.env.DEPLOY_KEY, 'base64').toString('utf-8');
    const wallet = JSON.parse(decoded);
    
    if (!wallet.privateKey) {
      return {
        isValid: false,
        message: 'Invalid DEPLOY_KEY format - missing privateKey'
      };
    }

    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      message: 'Invalid DEPLOY_KEY format - unable to decode'
    };
  }
} 