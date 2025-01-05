import { ANTRegistry } from '@ar.io/sdk';
import { formatSuccess, formatError } from '../../utils/index.js';
import { getWalletAddress } from '../../utils/wallet.js';
import { CheckResult } from './index.js';

export async function runAntCheck(): Promise<CheckResult> {
  try {
    const address = await getWalletAddress();
    const registry = ANTRegistry.init();
    const { Owned } = await registry.accessControlList({ address });

    console.log(`\nANTs for wallet ${address}:`);
    Owned.forEach((ant: string) => console.log(formatSuccess(ant)));

    return {
      success: true,
      message: `Found ${Owned.length} ANTs`
    };
  } catch (error) {
    console.error(formatError('Error:'), error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error during ANT check'
    };
  }
}