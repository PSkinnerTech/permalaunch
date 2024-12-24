# PR: Add `init` Command for Automated Deployment Key Setup

## Objective
Create a new `init` command that automates the wallet setup process for first-time users.

## Implementation Checklist
- [ ] Add `--init` flag to CLI options
- [ ] Create new `init.ts` command file
- [ ] Implement wallet file detection:
  - [ ] Search for `wallet.json`
  - [ ] Search for `keyfile*.json` pattern
  - [ ] Handle case when multiple key files are found
  - [ ] Handle case when no key files are found
- [ ] Implement Base64 encoding:
  - [ ] Read wallet file content
  - [ ] Convert to Base64 string
  - [ ] Validate encoded content
- [ ] Implement .env file handling:
  - [ ] Check for existing .env file
  - [ ] Create .env if it doesn't exist
  - [ ] Check for existing DEPLOY_KEY
  - [ ] Add or update DEPLOY_KEY variable
  - [ ] Preserve other existing environment variables
- [ ] Add user feedback messages:
  - [ ] Success messages
  - [ ] Error messages
  - [ ] Warning for existing DEPLOY_KEY
  - [ ] Instructions for manual setup if needed
- [ ] Update documentation:
  - [ ] Add init command to README
  - [ ] Update CHANGELOG
  - [ ] Update ROADMAP

## Testing Plan
- [ ] Test with existing wallet.json
- [ ] Test with keyfile*.json pattern
- [ ] Test with no wallet file
- [ ] Test with multiple wallet files
- [ ] Test with existing .env file
- [ ] Test with no .env file
- [ ] Test with existing DEPLOY_KEY
- [ ] Test error handling scenarios

## Security Considerations
- [ ] Ensure proper file permissions for .env
- [ ] Validate wallet file content before encoding
- [ ] Add warning about keeping wallet file secure
