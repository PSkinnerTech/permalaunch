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

## [0.0.1] - 2024-02-16
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

[Unreleased]: https://github.com/PSkinnerTech/permalaunch/compare/v0.0.1...HEAD
[0.0.1]: https://github.com/PSkinnerTech/permalaunch/releases/tag/v0.0.1
