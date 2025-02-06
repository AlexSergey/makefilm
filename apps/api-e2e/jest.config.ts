export default {
  coverageDirectory: '../../coverage/api-e2e',
  displayName: 'api-e2e',
  globalSetup: '<rootDir>/src/support/global-setup.ts',
  globalTeardown: '<rootDir>/src/support/global-teardown.ts',
  moduleFileExtensions: ['ts', 'js', 'html'],
  preset: '../../jest.preset.js',
  runInBand: true,
  setupFiles: ['<rootDir>/src/support/test-setup.ts'],
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/api/?(*.)+(e2e-spec).[jt]s?(x)'],
  transform: {
    '^.+\\.[tj]s$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
      },
    ],
  },
};
