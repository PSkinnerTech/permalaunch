# PR: Add `init` Command for Automated Deployment Key Setup

## Objective
Create a new `init` command that automates the wallet setup process for first-time users.

## Implementation Checklist
- [x] Add `--init` flag to CLI options
- [x] Create new `init.ts` command file
- [x] Implement wallet file detection:
  - [x] Search for `wallet.json`
  - [x] Search for `keyfile*.json` pattern
  - [x] Handle case when multiple key files are found
  - [x] Handle case when no key files are found
- [x] Implement Base64 encoding:
  - [x] Read wallet file content
  - [x] Convert to Base64 string
  - [x] Validate encoded content
- [x] Implement .env file handling:
  - [x] Check for existing .env file
  - [x] Create .env if it doesn't exist
  - [x] Check for existing DEPLOY_KEY
  - [x] Add or update DEPLOY_KEY variable
  - [x] Preserve other existing environment variables
- [x] Add user feedback messages:
  - [x] Success messages
  - [x] Error messages
  - [x] Warning for existing DEPLOY_KEY
  - [x] Instructions for manual setup if needed
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
- [x] Ensure proper file permissions for `.env`
- [x] Validate wallet file content before encoding
- [x] Add warning about keeping wallet file secure
