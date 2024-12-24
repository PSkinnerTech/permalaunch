# PERMALAUNCH

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

1. Set your deployment key:
```bash
export DEPLOY_KEY=your_base64_encoded_key
```

2. Deploy your app:
```bash
npx permalaunch --launch
```

## Usage

### Basic Commands

For a quick launch, use the following command:
```bash
npx permalaunch --quick-launch
```

### Individual Check Commands

```bash
npx permalaunch --check-wallet    # Verify wallet configuration
npx permalaunch --check-balances  # Check balances
npx permalaunch --check-build     # Validate build folder
npx permalaunch --check-ant       # Verify ANT configuration
npx permalaunch --check-git       # Check Git configuration
```

## Configuration

### Environment Variables

- `DEPLOY_KEY`: Base64 encoded Arweave wallet key (required)
- `GIT_HASH`: Git commit hash (optional)

## Documentation

For detailed documentation, visit [https://permalaunch.ar.io/docs](https://permalaunch.ar.io/docs)

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Copyright (c) 2024 Patrick Skinner (PSkinnerTech)
