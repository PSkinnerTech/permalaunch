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

## Related Commands
- For balance-related errors, see the Balance Check documentation
- For initialization errors, see the Init Command documentation 