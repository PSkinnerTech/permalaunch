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
- [x] Update documentation:
  - [x] Add init command to README
  - [x] Update CHANGELOG
  - [x] Update ROADMAP

## Testing Plan
- [x] Test with existing wallet.json
- [x] Test with keyfile*.json pattern
- [x] Test with no wallet file
- [x] Test with multiple wallet files
- [ ] Test with existing .env file
- [ ] Test with no .env file
- [ ] Test with existing DEPLOY_KEY
- [ ] Test error handling scenarios

## Security Considerations
- [ ] Ensure proper file permissions for .env
- [ ] Validate wallet file content before encoding
- [ ] Add warning about keeping wallet file secure
