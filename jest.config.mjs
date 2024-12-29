/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      useESM: true,
      tsconfig: 'tsconfig.json'
    }],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(ts-jest|@jest)/)'
  ],
  setupFilesAfterEnv: ['./jest.setup.ts'],
  clearMocks: true,
  resetMocks: false,
  restoreMocks: false
};

export default config; 