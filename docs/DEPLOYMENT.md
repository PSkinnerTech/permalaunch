# Deployment Guide

## Prerequisites
- Completed [environment setup](ENVIRONMENT-SETUP.md)
- Valid Arweave wallet with sufficient funds
- Built application (dist/, build/, or .next/)

## Pre-deployment Checklist
1. **Environment Check**
   - [ ] DEPLOY_KEY configured
   - [ ] ANT_PROCESS set (if using ar.io)
   - [ ] Build folder exists and contains files

2. **Balance Check**
   - [ ] Sufficient WINC balance
   - [ ] Sufficient AR balance
   - [ ] Estimated costs reviewed

3. **Build Check**
   - [ ] Bundle size within limits
   - [ ] All assets included
   - [ ] No sensitive files included

## Deployment Steps

### Standard Deployment
1. Run prelaunch checklist:
````
npx permalaunch --launch
````

2. Follow interactive prompts
3. Confirm deployment details
4. Wait for confirmation

### Quick Deployment
For CI/CD or experienced users:
````
npx permalaunch --quick-launch
````

## Post-deployment

### Verification
1. Check deployment status
2. Verify manifest upload
3. Confirm ANT record update (if applicable)
4. Test deployed application

### Monitoring
- Check deployment logs
- Monitor transaction status
- Verify DNS propagation (for ARNS)

## Troubleshooting

### Common Issues
1. **Deployment Timeout**
   - Check network connection
   - Verify transaction status
   - Review bundle size

2. **ANT Update Failure**
   - Verify ANT_PROCESS ID
   - Check permissions
   - Review ar.io status

3. **Build Issues**
   - Review [Environment Setup](ENVIRONMENT-SETUP.md)
   - Check build configuration
   - Verify file permissions

## Best Practices
- Always run prelaunch checklist
- Keep builds optimized
- Monitor deployment costs
- Maintain sufficient balance
- Use version control
- Document deployment configurations

## Advanced Configuration

### Custom Manifest
````
{
  "manifest": "arweave/paths",
  "version": "0.1.0",
  "index": {
    "path": "index.html"
  },
  "paths": {
    "index.html": {
      "id": "<transaction_id>"
    }
  }
}
````

### Environment Variables
See [Environment Setup](ENVIRONMENT-SETUP.md) for detailed configuration options.

## Related Documentation
- [Environment Setup](ENVIRONMENT-SETUP.md)
- [Error Messages](ERROR-MESSAGES.md)
- [Troubleshooting Guide](TROUBLESHOOTING.md)