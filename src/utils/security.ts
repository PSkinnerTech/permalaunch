import { createHash } from 'crypto';
import fs from 'fs';

export function validateEnvironmentVariables(): void {
  const requiredVars = ['DEPLOY_KEY'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
}

export function validateWalletFile(walletPath: string): void {
  if (!fs.existsSync(walletPath)) {
    throw new Error('Wallet file not found');
  }

  try {
    const walletContent = fs.readFileSync(walletPath, 'utf-8');
    const wallet = JSON.parse(walletContent);
    
    // Validate wallet structure
    if (!wallet.kty || !wallet.n || !wallet.e) {
      throw new Error('Invalid wallet format');
    }
    
    // Check file permissions
    const stats = fs.statSync(walletPath);
    if ((stats.mode & 0o777) !== 0o600) {
      console.warn('Warning: Wallet file permissions should be set to 600');
    }
  } catch (error: unknown) {
    throw new Error(`Wallet validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function sanitizeUserInput(input: string): string {
  // Remove any potentially dangerous characters
  return input.replace(/[;&|`$]/g, '');
}

export function hashSensitiveData(data: string): string {
  return createHash('sha256').update(data).digest('hex');
} 