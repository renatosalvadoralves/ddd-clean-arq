export default {
  ...require('../jest.config').default,
  displayName: {
    name: 'nestjs-e2e',
    color: 'yellow',
  },
  rootDir: './',
  testRegex: '.*\\.e2e-spec\\.ts$',
  maxWorkers: 1,
  setupFiles: ['<rootDir>/setup-test.ts'],
  moduleNameMapper: {
    'mycore/(.*)': '<rootDir>/../../../node_modules/mycore/dist/$1',
    '#shared/(.*)$': '<rootDir>/../../../node_modules/mycore/dist/shared/$1',
    '#category/(.*)$':
      '<rootDir>/../../../node_modules/mycore/dist/category/$1',
  },
};
