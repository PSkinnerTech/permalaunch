export const delay = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

export async function showCountdown(): Promise<void> {
  console.log('\n\x1b[35mINITIATING COUNTDOWN\x1b[0m');
  await delay(1000);
  console.log('\x1b[33m3...\x1b[0m');
  await delay(1000);
  console.log('\x1b[33m2...\x1b[0m');
  await delay(1000);
  console.log('\x1b[33m1...\x1b[0m');
  await delay(1000);
  console.log('\x1b[35mBLAST OFF!\x1b[0m\n');
}

export const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  magenta: '\x1b[35m'
} as const;

export function formatSuccess(message: string): string {
  return `${colors.green}${message}${colors.reset}`;
}

export function formatError(message: string): string {
  return `${colors.red}${message}${colors.reset}`;
}

export function formatWarning(message: string): string {
  return `${colors.yellow}${message}${colors.reset}`;
}

export function formatHighlight(message: string): string {
  return `${colors.magenta}${message}${colors.reset}`;
}
