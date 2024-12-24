
# Phase 1: Building and Testing a Safety-First CLI Tool

This document provides a step-by-step guide to implementing and testing a safety-first CLI tool that scans for sensitive information like wallet files, Base64-encoded secrets, and API keys.

---

## **1. Writing the Scanner Logic**

### **Wallet and Key Files**
Detect files like `wallet.json`, `*.key.json`, or `*hash.json` that should never be pushed to a repository.

#### Implementation:
```javascript
const glob = require('glob');

function scanForWalletFiles() {
  const patterns = ['**/wallet.json', '**/*.key.json', '**/*hash.json'];
  const walletFiles = patterns
    .map((pattern) => glob.sync(pattern, { nodir: true }))
    .flat();

  if (walletFiles.length > 0) {
    console.warn('Wallet or key files detected:');
    walletFiles.forEach((file) => console.warn(`  - ${file}`));
    return false; // Mark as unsafe
  }
  return true;
}
```

---

### **Base64-Encoded Secrets**
Scan files for Base64 strings, which are commonly used to hide sensitive data.

#### Implementation:
```javascript
const fs = require('fs');
const glob = require('glob');

function scanForBase64Strings(directory) {
  const files = glob.sync(`${directory}/**/*`, { nodir: true });
  const base64Regex = /(?:[A-Za-z0-9+/]{4}){2,}(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?/g;

  let hasBase64 = false;

  files.forEach((file) => {
    if (fs.lstatSync(file).isFile()) {
      const content = fs.readFileSync(file, 'utf-8');
      if (base64Regex.test(content)) {
        console.warn(`Potential Base64-encoded secret found in ${file}`);
        hasBase64 = true;
      }
    }
  });

  return !hasBase64; // Return false if any Base64 secrets are found
}
```

---

### **API Keys**
Identify hardcoded API keys using regex patterns.

#### Implementation:
```javascript
function scanForApiKeys(directory) {
  const files = glob.sync(`${directory}/**/*.{js,ts,json,env}`, { nodir: true });
  const apiKeyRegex = /(API_KEY|SECRET_KEY|PRIVATE_KEY|ACCESS_TOKEN|apiKey|secretKey)[=:]["']?[A-Za-z0-9._-]+["']?/g;

  let hasApiKeys = false;

  files.forEach((file) => {
    const content = fs.readFileSync(file, 'utf-8');
    const matches = content.match(apiKeyRegex);
    if (matches) {
      console.warn(`Potential API keys found in ${file}:`);
      console.warn(matches.join('\n'));
      hasApiKeys = true;
    }
  });

  return !hasApiKeys; // Return false if any API keys are found
}
```

---

### **Combine the Scanners**
Integrate all scans into a single safety check function.
```javascript
function runSafetyChecks() {
  const currentDirectory = process.cwd();
  console.log('Running safety checks...');

  const isWalletSafe = scanForWalletFiles();
  const isBase64Safe = scanForBase64Strings(currentDirectory);
  const isApiKeySafe = scanForApiKeys(currentDirectory);

  if (isWalletSafe && isBase64Safe && isApiKeySafe) {
    console.log('✅ All safety checks passed. No sensitive data detected.');
    process.exit(0); // Exit with success
  } else {
    console.error('❌ Safety checks failed. Sensitive data detected.');
    process.exit(1); // Exit with failure
  }
}
```

---

## **2. Testing the Scanner Logic**

### **Unit Testing**
Use Jest or Mocha/Chai to verify individual functions.

#### Jest Setup:
Install Jest:
```bash
npm install jest --save-dev
```

Write tests for `scanForWalletFiles`:
```javascript
const { scanForWalletFiles } = require('./scanner');

describe('Wallet File Detection', () => {
  it('should detect wallet.json files', () => {
    const mockFiles = ['test/wallet.json', 'test/key.hash.json'];
    jest.spyOn(fs, 'readdirSync').mockReturnValue(mockFiles);

    const result = scanForWalletFiles();
    expect(result).toBe(false);
  });

  it('should pass when no wallet files are found', () => {
    const mockFiles = ['test/safe-file.txt'];
    jest.spyOn(fs, 'readdirSync').mockReturnValue(mockFiles);

    const result = scanForWalletFiles();
    expect(result).toBe(true);
  });
});
```

Run tests:
```bash
npm test
```

---

### **Integration Testing**
Test the CLI as a whole using `child_process.spawn`.

#### Example:
```javascript
const { spawnSync } = require('child_process');

describe('CLI Integration Tests', () => {
  it('should detect unsafe files and block initialization', () => {
    const result = spawnSync('node', ['path/to/cli.js', 'init'], {
      cwd: 'test-directory-with-sensitive-files',
      encoding: 'utf-8',
    });

    expect(result.stdout).toContain('Sensitive files detected');
    expect(result.status).toBe(1);
  });

  it('should pass when no sensitive files are found', () => {
    const result = spawnSync('node', ['path/to/cli.js', 'init'], {
      cwd: 'test-safe-directory',
      encoding: 'utf-8',
    });

    expect(result.stdout).toContain('✅ All safety checks passed');
    expect(result.status).toBe(0);
  });
});
```

---

### **Mock Repositories**
Set up mock directories to simulate real-world cases:
1. `mock-repo-safe`: No sensitive files.
2. `mock-repo-sensitive`: Contains wallet files, Base64 strings, and API keys.

Run the CLI on these directories to validate behavior.

---

### **Static Code Analysis**
Use ESLint for code quality checks:
```bash
npm install eslint --save-dev
npx eslint .
```

---

### **3. Publishing and Final Checks**

1. **Manual Testing**:
   Run `npx permalaunch init` in different environments and scenarios.

2. **GitHub Actions**:
   Automate testing on each push:
   ```yaml
   name: CLI Tests

   on:
     push:
       branches:
         - main

   jobs:
     test:
       runs-on: ubuntu-latest
       steps:
         - name: Checkout code
           uses: actions/checkout@v2

         - name: Setup Node.js
           uses: actions/setup-node@v3
           with:
             node-version: 16

         - name: Install dependencies
           run: npm install

         - name: Run tests
           run: npm test
   ```

3. **Publish to npm**:
   When all tests pass:
   ```bash
   npm publish
   ```

---

This guide ensures your CLI tool is safe, well-tested, and ready for production.
