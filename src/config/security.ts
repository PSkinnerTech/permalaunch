export const securityConfig = {
  maxRetries: 3,
  timeoutMs: 5000,
  minPasswordLength: 12,
  allowedOrigins: ['https://arweave.net', 'https://ar.io'],
  sensitiveKeys: ['DEPLOY_KEY', 'WALLET_KEY', 'API_KEY'],
  filePermissions: {
    wallet: 0o600,
    config: 0o644
  }
}; 