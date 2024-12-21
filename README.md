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

## Installation

```bash
npm install -g permalaunch
```

## Quick Start

1. Set your deployment key:
```bash
export DEPLOY_KEY=your_base64_encoded_key
```

2. Deploy your app:
```bash
permalaunch --launch
```

## Usage

### Basic Commands

- `--launch`: Deploy your app to Arweave
- `--quick-launch`: Deploy without checks
- `--prelaunch-checklist`: Run a comprehensive deployment readiness check

### Individual Check Commands

- `--check-wallet`: Verify wallet configuration
- `--check-balances`: Check AR, tARIO, and Turbo Credit balances
- `--check-build`: Validate build folder and estimate deployment costs
- `--check-ant`: Verify ANT configuration (for ARNS domains)
- `--check-git`: Check Git configuration for automated deployments

### Options

- `--ant-process, -a`: Specify ANT process for ARNS domains
- `--deploy-folder, -d`: Specify build folder (default: checks ./dist, ./build, ./.next)
- `--undername, -u`: Specify ANT undername (default: @)

## Examples

### Basic Deployment
```bash
permalaunch --launch
```

### Quick Deployment (Skip Checks)
```bash
permalaunch --quick-launch
```

### Deploy to ARNS Domain
```bash
permalaunch --launch --ant-process myapp.ar-io.dev --undername staging
```

### Custom Build Folder
```bash
permalaunch --launch --deploy-folder ./out
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
