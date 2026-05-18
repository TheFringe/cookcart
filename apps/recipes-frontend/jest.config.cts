module.exports = {
  displayName: '@recipes/recipes-frontend',
  preset: '../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
    '^.+\\.[tj]sx?$': '<rootDir>/jest-import-meta-transform.cjs',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: 'test-output/jest/coverage',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};
