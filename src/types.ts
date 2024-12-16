export interface DeployArgs {
    antProcess: string;
    deployFolder: string;
    undername: string;
    launch: boolean;
    'prelaunch-checklist': boolean;
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