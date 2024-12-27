# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [0.0.6] - 2024-12-26
### Added
- Balance check command implementation
  - Basic balance verification
  - Cost estimation functionality
  - User funding guidance
  - Integration with wallet validation
- Enhanced error handling for balance checks
- Comprehensive error documentation
- Updated roadmap with balance features

### Changed
- Separated balance checking from wallet validation
- Updated documentation structure
- Improved command help text
- Enhanced user feedback for funding requirements

### Documentation
- Added balance check error messages to ERROR-MESSAGES.md
- Updated ROADMAP.md with test coverage goals
- Enhanced README with balance check examples
- Created BALANCES-CHECK.md for implementation tracking

### Known Issues
- Incomplete test coverage for balance check command
- TypeScript issues with mock implementations
- Edge case testing needs improvement

## [0.0.5] - 2024-12-26
### Added
- Comprehensive test suite for wallet check command
- Enhanced documentation structure and organization
- Clear separation between wallet and balance checks

### Changed
- Moved documentation files to /docs folder
- Refactored wallet check to focus on core validation
- Separated balance checking into its own command

### Documentation
- Added ERROR-MESSAGES.md for centralized error documentation
- Created COMMAND-RELATIONSHIPS.md for architecture clarity
- Updated WALLET-CHECK.md with completed items
- Added BALANCES-CHECK.md for upcoming implementation

## [0.0.4] - 2024-12-25
### Added
- New `--init` command for automated wallet setup
- Secure .env file handling with proper permissions
- Wallet file validation and security checks
- Comprehensive test suite for init command
- Enhanced error handling for wallet setup

### Security
- Added file permission restrictions for .env files
- Implemented wallet content validation
- Added security warnings for wallet handling
- Enhanced gitignore validation

## [0.0.3] - 2024-12-24
### Added
- Interactive launch confirmation with inquirer
- Proper content-type detection for all file types
- Improved file handling for both directories and files
- Enhanced deployment status messages
- Deployment URL display after successful upload

### Changed
- Refactored quickLaunch for better reliability
- Improved build folder detection and handling
- Removed redundant 5-second delay from launch sequence
- Enhanced error handling and feedback
- Streamlined deployment process

### Fixed
- EISDIR error in quickLaunch
- Build folder path resolution
- Manifest generation and upload process
- ANT record updates

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
[0.0.4]: https://github.com/PSkinnerTech/permalaunch/compare/v0.0.3...v0.0.4
