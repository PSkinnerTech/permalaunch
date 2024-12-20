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