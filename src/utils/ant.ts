import { ANT, ArweaveSigner } from '@ar.io/sdk';
import { Tag } from '../types.js';
import { formatError } from './display.js';

interface AntConfig {
  contractTxId: string;
  host: string;
  port: number;
  protocol: string;
}

export function checkAntProcess(antProcess?: string): boolean {
  return !!antProcess && antProcess.length > 0;
}

export async function updateAntRecord(
  antProcess: string, 
  undername: string, 
  manifestId: string, 
  encodedWallet: string,
  tags: Tag[] = []
): Promise<void> {
  try {
    const wallet = JSON.parse(Buffer.from(encodedWallet, 'base64').toString());
    const ant = ANT.init({
      signer: new ArweaveSigner(wallet),
      processId: antProcess
    });
    
    await ant.setRecord({
      undername,
      transactionId: manifestId,
      ttlSeconds: 3600
    }, { tags });
  } catch (error) {
    console.error(formatError('Error updating ANT record:'), error);
    throw error;
  }
}

export async function validateAntConfig(
  antProcess: string, 
  undername: string,
): Promise<boolean> {
  try {
    const ant = ANT.init({ processId: antProcess });
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

export const getAntConfig = async (): Promise<AntConfig> => {
  return {
    contractTxId: '',
    host: '',
    port: 443,
    protocol: 'https'
  };
};
