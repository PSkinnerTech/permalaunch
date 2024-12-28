# Troubleshooting Guide

## Common Issues

### Initialization Issues
```bash
Error: Wallet file not found
```
- Check if wallet.json exists in your project root
- Ensure wallet file has correct format
- Verify file permissions (should be 600)

```bash
Error: Missing required environment variables
```
- Run `permalaunch --init` to set up environment
- Check if .env file exists and contains DEPLOY_KEY
- Verify DEPLOY_KEY is properly base64 encoded

### Deployment Issues
```bash
Error: Insufficient balance
```
- Check wallet balance using `permalaunch --check-balances`
- Visit https://turbo.ar.io to get WINC tokens
- Ensure you have enough AR for the deployment

```bash
Error: Build folder not found
```
- Run your build command (npm run build)
- Check if dist/build/.next folder exists
- Verify build folder configuration

### Permission Issues
```bash
Error: EACCES: permission denied
```
- Check file permissions
- Run with appropriate user privileges
- Verify directory access rights

## CI/CD Troubleshooting

### GitHub Actions
- Verify secrets are properly configured
- Check Node.js version compatibility
- Ensure all required dependencies are installed

### Test Failures
- Run tests locally with `npm test`
- Check Jest configuration
- Verify TypeScript compilation

## Getting Help
- Open an issue on GitHub
- Include error messages and logs
- Provide environment details 