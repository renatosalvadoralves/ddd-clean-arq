export default {
  displayName: {
    name: 'nestjs',
    color: 'magentaBright',
  },
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\..*spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': '@swc/jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  testEnvironment: 'node',
  moduleNameMapper: {
    'mycore/(.*)': '<rootDir>/../../../node_modules/mycore/dist/$1',
    '#shared/(.*)$': '<rootDir>/../../../node_modules/mycore/dist/shared/$1',
    '#category/(.*)$':
      '<rootDir>/../../../node_modules/mycore/dist/category/$1',
  },
  setupFilesAfterEnv: [
    '../../@core/src/shared/domain/tests/setup.ts',
    '../../@core/src/shared/domain/tests/jest.ts',
  ],
  coverageDirectory: '../coverage',
  coverageProvider: 'v8',
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
};
