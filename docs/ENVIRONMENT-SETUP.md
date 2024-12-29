# Environment Setup Guide

## Prerequisites
- Node.js (v18.x or v20.x)
- npm (v8 or higher)
- Git (for version control)

## Installation

1. **Install the Package**
```bash
npm install -g permalaunch
```

2. **Initialize Configuration**
```bash
npx permalaunch --init
```

## Environment Variables

### Required Variables
- `DEPLOY_KEY`: Your Arweave wallet key (JWK)
  - Generated during initialization
  - Must be base64 encoded

### Optional Variables
- `ANT_PROCESS`: Your ar.io ANT process ID
- `GITHUB_SHA`: Git commit hash for deployment tracking

## Configuration Files

### .env File Structure
```env
DEPLOY_KEY=<base64_encoded_wallet_key>
ANT_PROCESS=<your_ant_process_id>
GITHUB_SHA=<git_commit_hash>
```

### Security Considerations
- Never commit `.env` file to version control
- Ensure `.gitignore` includes:
```
.env
wallet.json
keyfile.json
arweave.json
```

## Build Configuration

### Bundle Size Limits
```json
{
  "bundlesize": [
    {
      "path": "./dist/**/*.js",
      "maxSize": "500kB"
    },
    {
      "path": "./dist/**/*.d.ts",
      "maxSize": "50kB"
    }
  ]
}
```

## Verification Steps

1. **Check Environment**
```bash
npx permalaunch --check-wallet
```

2. **Verify Build Setup**
```bash
npx permalaunch --check-build
```

3. **Check Balances**
```bash
npx permalaunch --check-balances
```

## Troubleshooting

### Common Issues

1. **Wallet Not Found**
   - Run `npx permalaunch --init` to set up wallet
   - Check `.env` file exists and contains `DEPLOY_KEY`

2. **Build Errors**
   - Ensure build folder exists (dist/, build/, or .next/)
   - Check bundle size limits
   - Verify TypeScript configuration

3. **Balance Issues**
   - Ensure wallet has sufficient WINC/AR
   - Check deployment cost estimates
   - Verify wallet connection

### Getting Help
- Check [Error Messages](ERROR-MESSAGES.md) documentation
- Review [Contributing Guide](../CONTRIBUTING.md)
- Visit [ar.io/docs](https://ar.io/docs) for ANT setup

## Next Steps
1. Run prelaunch checklist
2. Configure optional integrations
3. Deploy your first application

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md)
