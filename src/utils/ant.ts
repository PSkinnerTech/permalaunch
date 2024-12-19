import { ANT, ArweaveSigner } from '@ar.io/sdk';
import { Tag } from '../types.js';
import { formatError } from './display.js';

export function checkAntProcess(antProcess?: string): boolean {
  return !!antProcess && antProcess.length > 0;
}

export async function updateAntRecord(
  antProcess: string, 
  undername: string, 
  manifestId: string, 
  wallet: any, 
  tags: Tag[] = []
): Promise<void> {
  try {
    const signer = new ArweaveSigner(wallet);
    const ant = ANT.init({ processId: antProcess, signer });

    await ant.setRecord(
      {
        undername,
        transactionId: manifestId,
        ttlSeconds: 3600,
      },
      {
        tags: [
          ...tags,
          {
            name: 'App-Name',
            value: 'ARIO-Deploy',
          },
        ],
      }
    );
  } catch (error) {
    console.error(formatError('Error updating ANT record:'), error);
    throw error;
  }
}

export async function validateAntConfig(
  antProcess: string, 
  undername: string, 
  wallet: any
): Promise<boolean> {
  try {
    const signer = new ArweaveSigner(wallet);
    const ant = ANT.init({ processId: antProcess, signer });
    
    // Pass an object with undername property
    await ant.getRecord({ undername });
    return true;
  } catch (error) {
    console.error(formatError('Error validating ANT configuration:'), error);
    return false;
  }
}

export function getAntUrl(antProcess: string, undername: string): string {
  const baseUrl = 'https://';
  const domain = antProcess.includes('.') ? antProcess : `${antProcess}.ar-io.dev`;
  return `${baseUrl}${undername === '@' ? '' : `${undername}.`}${domain}`;
}
