# Roadmap

## Completed Features
- [x] `--launch` flag implementation for deploying apps to Arweave (2024-12-19)
- [x] `--prelaunch-checklist` comprehensive deployment readiness check (2024-12-19)
- [x] Individual check commands:
  - [x] `--check-wallet` (2024-12-19)
  - [x] `--check-balances` (2024-12-19)
  - [x] `--check-build` (2024-12-19)
  - [x] `--check-ant` (2024-12-19)
  - [x] `--check-git` (2024-12-19)
- [x] `--init` command for secure wallet setup (2024-12-26)
  - [x] Automated wallet detection
  - [x] Secure .env file creation
  - [x] File permission handling
  - [x] Comprehensive validation
- [x] Optimize `--launch` command:
  - [x] Make GIT HASH optional (2024-12-19)
  - [x] Make ANT PROCESS optional (2024-12-19)
- [x] Add `--quick-launch` flag for bypassing checks (2024-12-24)
- [x] Add `--help` flag for CLI documentation (2024-12-19)
- [x] Implement TurboDeploy utility for efficient file uploads (2024-12-24)
- [x] Add comprehensive error handling and user feedback (2024-12-24)
- [x] Support multiple build folder types (dist, build, .next) (2024-12-24)
- [x] Interactive deployment confirmation (2024-12-24)
- [x] Balance check command implementation (2024-12-26)
  - [x] Basic balance verification
  - [x] Cost estimation
  - [x] User feedback
  - [ ] Complete test coverage (moved to Short-term Goals)

## Short-term Goals
- [ ] Complete security test implementation
  - [ ] Fix Jest mock type issues
  - [ ] Add proper fs mocking setup
  - [ ] Complete test coverage for security utils
- [ ] Complete balance check test implementation
  - [ ] Fix TypeScript mock issues
  - [ ] Add edge case coverage
  - [ ] Improve error scenario testing
- [ ] Add automated code quality checks
  - [ ] ESLint configuration
  - [ ] Prettier setup
  - [ ] Breaking change detection
- [ ] Implement security best practices
  - [ ] API key management
  - [ ] Wallet operation patterns
  - [ ] ANT security guidelines
- [ ] Add comprehensive test suite
- [ ] Upload to npm
- [ ] Add CI/CD pipeline
- [ ] Develop a `--configure-ant` wizard for easily selecting ARNS domains
- [ ] Add support for custom manifest configurations
- [ ] Implement deployment progress bar
- [ ] Add deployment size estimation
- [ ] Support for environment variables
- [ ] Add deployment cost estimation in AR/USD

## Long-term Goals
- [ ] Add support for multiple deployment strategies
- [ ] Implement rollback functionality
- [ ] Add deployment analytics
- [ ] Create web interface for deployments
- [ ] Support for deployment previews
- [ ] Add support for custom deployment hooks
- [ ] Implement deployment caching
- [ ] Add support for deployment versioning
- [ ] Advanced balance monitoring features
  - [ ] Historical cost tracking
  - [ ] Automated funding alerts
  - [ ] Balance threshold notifications
- [ ] Advanced code quality tooling
  - [ ] Custom ESLint rules for wallet operations
  - [ ] Automated breaking change detection
  - [ ] Code style automation
- [ ] Enhanced security features
  - [ ] Advanced API key rotation
  - [ ] Wallet operation monitoring
  - [ ] Permission management system

## To-Do's
- [ ] ESLint
- [ ] Prettier
- [x] Jest
- [ ] Different commands for different frameworks?
- [ ] Commander? CLI framework
- [ ] Tan Stack tooling?
- [ ] https://github.com/TanStack/form/tree/main/packages
