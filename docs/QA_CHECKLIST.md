# QA Checklist

This document outlines the manual testing steps to be performed before each release. Check off each item as you verify functionality.

## Core Commands
- [ ] `--help` displays comprehensive CLI documentation
- [x] `init` command
  - [x] Detects existing wallet.json
  - [x] Creates .env file with proper permissions
  - [x] Validates wallet configuration
  - [x] Handles errors gracefully (missing files, invalid wallet)

## Check Commands
- [ ] `--check-wallet`
  - [ ] Verifies wallet.json existence
  - [ ] Validates DEPLOY_KEY format
  - [ ] Validates .env file exists in the root of the project
  - [ ] If .env file is missing, asks the user if they want the .env created for them. If yes, creates it in the root of the project
  - [ ] If wallet.json is found, but can't validate the DEPLOY_KEY, encodes the wallet.json and sets DEPLOY_KEY in the .env file
  - [ ] Confirms wallet address is valid
  - [ ] Shows appropriate error messages

- [ ] `--check-balances`
  - [ ] Displays current wallet balance
  - [ ] Shows cost estimation
  - [ ] Handles insufficient funds scenario
  - [ ] Displays AR/USD conversion (if implemented)

- [ ] `--check-build`
  - [ ] Detects build folder (dist, build, .next)
  - [ ] Validates build contents
  - [ ] Reports build size
  - [ ] Shows appropriate errors for missing/invalid builds

- [ ] `--check-ant`
  - [ ] Validates ANT configuration
  - [ ] Checks ANT process status
  - [ ] Verifies ARNS domain settings
  - [ ] Shows clear error messages

- [ ] `--check-git`
  - [ ] Verifies git repository status
  - [ ] Validates git hash
  - [ ] Shows appropriate warnings/errors

## Deployment Features
- [ ] `--launch` command
  - [ ] Runs pre-launch checklist
  - [ ] Handles GIT HASH (both with and without)
  - [ ] Handles ANT PROCESS (both with and without)
  - [ ] Shows interactive confirmation
  - [ ] Displays deployment progress
  - [ ] Successfully uploads files
  - [ ] Shows final deployment URL

- [ ] `--quick-launch`
  - [ ] Bypasses pre-launch checks
  - [ ] Maintains essential validations
  - [ ] Deploys successfully
  - [ ] Shows appropriate warnings

## Cross-Platform Testing
- [ ] Windows
  - [ ] File path handling
  - [ ] Environment variable management
  - [ ] File permissions
  
- [ ] Unix/Linux
  - [ ] File path handling
  - [ ] Environment variable management
  - [ ] File permissions

## Error Handling
- [ ] Missing wallet file
- [ ] Invalid wallet format
- [ ] Network connectivity issues
- [ ] Insufficient permissions
- [ ] Invalid build directory
- [ ] Missing dependencies

## Security Checks
- [ ] Wallet file permissions are secure
- [ ] Environment variables are properly protected
- [ ] Sensitive data is not logged
- [ ] Base64 encoding is working correctly

## Performance
- [ ] Command execution time is reasonable
- [ ] Large file handling is efficient
- [ ] Memory usage is within acceptable limits

## Notes
- Document any failing tests or unexpected behavior
- Note platform-specific issues
- Record any performance concerns
- List any security considerations

Last Tested Version: ________________
Date: ________________
Tested By: ________________ 