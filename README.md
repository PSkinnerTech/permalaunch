# Permalaunch

Deploy your web apps to the permaweb with ease! Permalaunch is a CLI tool that simplifies the process of deploying applications to Arweave.

## BETA

This is a beta release. Please report any issues to [https://github.com/pskinnertech/permalaunch/issues](https://github.com/pskinnertech/permalaunch/issues)
When this tool is ready for production, it will be renamed, this CLI will be deprecated, and the tool will be moved to a new repository.

## Features

- 🚀 One-command deployment to Arweave
- 🔍 Comprehensive pre-launch checks
- 🌐 ANT (Arweave Name System) integration
- 🔄 Git integration for versioning
- ⚡ Quick launch option for rapid deployments
- 💳 Balance and cost estimation
- 📁 Support for multiple build types (dist, build, .next)

## Quick Start

1. Initialize your deployment key:
```bash
npx permalaunch init
```

2. Deploy your app:
```bash
npx permalaunch --launch
```

## Usage

### Basic Commands

```bash
npx permalaunch --init          # Set up your wallet securely
npx permalaunch --launch       # Full deployment with checks
npx permalaunch --quick-launch # Quick deployment without checks
```

### Individual Check Commands

```bash
npx permalaunch --check-wallet    # Verify wallet configuration
npx permalaunch --check-balances  # Check balances and estimate costs
npx permalaunch --check-build     # Validate build folder
npx permalaunch --check-ant       # Verify ANT configuration
npx permalaunch --check-git       # Check Git configuration
```

### Balance Check Command
The balance check command verifies your wallet's financial readiness:
- Validates wallet configuration
- Checks WINC and AR balances
- Estimates deployment costs
- Provides funding guidance

Example output:
```bash
CHECK BALANCES:
[ x ] Turbo Balance: 1000000 WINC
[ x ] AR Balance: 1.5 AR
[ x ] Estimated Deployment Cost: 500000 WINC
```

## Documentation

For detailed documentation:
- [Error Messages](docs/ERROR-MESSAGES.md)
- [Contributing Guide](CONTRIBUTING.md)
- [Roadmap](docs/ROADMAP.md)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Copyright (c) 2024 Patrick Skinner (PSkinnerTech)
