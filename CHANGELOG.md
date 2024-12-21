# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]
### Added
- Individual check commands implementation
- Error handling for optional parameters
- Enhanced documentation for each command
- `--quick-launch` flag for bypassing prelaunch checks
- `--help` flag for CLI documentation
- Interactive prelaunch checklist in `--launch` command

## [0.0.2] - 2024-12-19
### Added
- TurboDeploy utility implementation
- Streamlined deployment process with `quickLaunch`
- Comprehensive test suite setup
- Enhanced error handling and user feedback
- Content-type detection for uploads
- Support for recursive directory uploads
- Automatic Git tag integration
- Improved ANT deployment workflow

### Changed
- Refactored command structure for better maintainability
- Enhanced check system with detailed feedback
- Optimized file upload process with Turbo SDK
- Improved manifest handling and validation

## [0.0.1] - 2024-12-16
### Added
- Initial project setup
- `--launch` flag implementation for deploying apps to Arweave
- `--prelaunch-checklist` comprehensive deployment readiness check
- Individual check commands:
  - `--check-wallet`
  - `--check-balances`
  - `--check-build`
  - `--check-ant`
  - `--check-git`
### Changed
- Optimized `--launch` command:
  - Made GIT HASH optional
  - Made ANT PROCESS optional

[Unreleased]: https://github.com/PSkinnerTech/permalaunch/compare/v0.0.2...HEAD
[0.0.2]: https://github.com/PSkinnerTech/permalaunch/compare/v0.0.1...v0.0.2
[0.0.1]: https://github.com/PSkinnerTech/permalaunch/releases/tag/v0.0.1