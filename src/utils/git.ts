import fs from 'fs';
import { formatError, formatWarning } from './display.js';

export function checkGitHash(): { exists: boolean; hash: string | null } {
  const gitHash = process.env.GITHUB_SHA;
  return {
    exists: !!gitHash,
    hash: gitHash || null
  };
}

export function checkGithubWorkflow(): boolean {
  try {
    return fs.existsSync('./.github/workflows/deploy.yml') || 
           fs.existsSync('./.github/workflows/deploy.yaml');
  } catch (error) {
    console.error(formatError('Error checking GitHub workflow file:'), error);
    return false;
  }
}

export function displayGitStatus(): void {
  const { exists: hashExists, hash } = checkGitHash();
  const workflowExists = checkGithubWorkflow();

  if (hashExists) {
    console.log(`\x1b[32m[ x ] GIT-HASH Identified\x1b[0m`);
    console.log(`\x1b[32m[ x ] GIT-HASH:\x1b[0m ${hash}`);
  } else {
    console.log(`\x1b[31m[   ] GIT-HASH Identified\x1b[0m`);
    console.log(`\x1b[31m[   ] GIT-HASH:\x1b[0m Not configured`);
    console.log(formatWarning('\nConfiguring a GIT-HASH isn\'t required for deploying your app onto Arweave. ' + 
      'This variable is only required if you want to set up automatic redeployments every time you push a new commit to the github repo. ' +
      'To learn more about how to do this, go to \x1b[35mhttps://permalaunch.ar.io/docs\x1b[33m.\n'));
  }

  if (workflowExists) {
    console.log(`\x1b[32m[ x ] GitHub Workflow File Identified\x1b[0m`);
  } else {
    console.log(`\x1b[31m[   ] GitHub Workflow File Identified\x1b[0m`);
    if (!hashExists) {
      console.log(formatWarning('A github.yaml file is required for automatic deployments. ' + 
        'You can find an example configuration at \x1b[35mhttps://permalaunch.ar.io/docs\x1b[33m.'));
    }
  }
}

export function getGitTags(): { name: string; value: string }[] {
  const tags: { name: string; value: string }[] = [];
  const gitHash = process.env.GITHUB_SHA;
  
  if (gitHash) {
    tags.push({
      name: 'GIT-HASH',
      value: gitHash
    });
  }
  
  return tags;
}
