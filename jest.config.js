module.exports = {
  cacheDirectory: '<rootDir>/.jest-cache',
  preset: 'ts-jest',
  setupFiles: ['./src/test/setupPromiseWarnings'],
  transform: {
    '^.+\\.tsx?$': 'babel-jest',
    'node_modules/variables/.+\\.(j|t)sx?$': 'ts-jest',
  },
  transformIgnorePatterns: ['node_modules/(?!variables/.*)'],
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
  watchPathIgnorePatterns: [
    '<rootDir>/jest.json',
    '<rootDir>/test-report.json',
  ],
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
};
