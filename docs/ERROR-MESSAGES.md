# Error Messages Documentation

## Wallet Check Command Errors

### Initialization Errors
- `Init not run - .env file not found. Please run: npx permalaunch --init`
  - Occurs when: The initialization process hasn't been completed
  - Solution: Run `npx permalaunch --init` to set up your wallet

- `Init incomplete - DEPLOY_KEY not found in environment`
  - Occurs when: The .env file exists but DEPLOY_KEY is missing
  - Solution: Check your .env file or re-run initialization

### Wallet Validation Errors
- `Failed to validate wallet address`
  - Occurs when: The DEPLOY_KEY contains invalid wallet data
  - Solution: Ensure your wallet key is properly formatted and base64 encoded
  - Note: If this persists, try re-running initialization

### General Errors
- `Unknown error during wallet check`
  - Occurs when: An unexpected error happens during validation
  - Solution: Check your network connection and try again
  - Note: If the issue persists, please report it as a bug

## Balance Check Command Errors

### Initialization Errors
- `DEPLOY_KEY environment variable not found`
  - Occurs when: No DEPLOY_KEY is configured in the environment
  - Solution: Run `npx permalaunch --init` to set up your wallet

### Balance Retrieval Errors
- `Network error during balance check`
  - Occurs when: Cannot connect to Arweave network
  - Solution: Check your internet connection and try again

### Cost Estimation Errors
- `No build folder found for cost estimation`
  - Occurs when: No valid build folder (dist, build, .next) exists
  - Solution: Run your build command first

- `Insufficient balance for deployment`
  - Occurs when: Wallet balance is lower than estimated deployment cost
  - Solution: Visit https://turbo.ar.io to get WINC tokens

### General Errors
- `Unknown error during balance check`
  - Occurs when: An unexpected error occurs
  - Solution: Check logs and try again
  - Note: If issue persists, please report it as a bug

## Related Commands
- For wallet validation errors, see the Wallet Check documentation
- For initialization errors, see the Init Command documentation 