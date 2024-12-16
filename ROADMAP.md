# Roadmap

## Completed Features
- [x] `--launch` flag implementation for deploying apps to Arweave (2024-12-15)
- [x] `--prelaunch-checklist` comprehensive deployment readiness check (2024-12-15)
- [x] Individual check commands:
  - [x] `--check-wallet` (2024-12-16)
  - [x] `--check-balances` (2024-12-16)
  - [x] `--check-build` (2024-12-16)
  - [x] `--check-ant` (2024-12-16)
  - [x] `--check-git` (2024-12-16)
- [x] Optimize `--launch` command:
  - [x] Make GIT HASH optional (2024-12-16)
  - [x] Make ANT PROCESS optional (2024-12-16)
- [x] Add `--quick-launch` flag for bypassing checks (2024-12-16)
- [x] Add `--help` flag for CLI documentation (2024-12-16)

## Short-term Goals
- [ ] Upload to npm
- [ ] Develop a `--configure-ant` wizard for easily selecting ARNS domains and undernames to deploy to
- [ ] Develop a CLI for installing multiple framework options with permalaunch pre-configured