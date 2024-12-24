export interface DeployArgs {
    antProcess: string;
    deployFolder: string;
    undername: string;
    launch: boolean;
    'quick-launch': boolean;
    'prelaunch-checklist': boolean;
    'check-wallet': boolean;
    'check-balances': boolean;
    'check-build': boolean;
    'check-ant': boolean;
    'check-git': boolean;
    'help': boolean;
  }
  
  export interface ArweaveManifest {
    manifest: string;
    version: string;
    index: {
      path: string;
    };
    fallback: {
      id?: string;
    };
    paths: {
      [key: string]: {
        id: string;
      };
    };
  }
  
  export interface Tag {
    name: string;
    value: string;
  }
  
  export interface BalanceInfo {
    turboBalance: string;
    arBalance: string;
    tarioBalance: string;
  }
  
  export interface BuildInfo {
    exists: boolean;
    type: string | null;
  }
  
  export interface CriticalChecks {
    walletExists: boolean;
    walletEncoded: boolean;
    buildExists: boolean;
    sufficientBalance: boolean;
  }
  
  export interface CheckResult {
    success: boolean;
    message?: string;
  }
  
  export interface PrelaunchCheckResults {
    wallet: CheckResult;
    balance: CheckResult;
    build: CheckResult;
    ant: CheckResult;
    git: CheckResult;
    launchConfirmed: boolean;
  }