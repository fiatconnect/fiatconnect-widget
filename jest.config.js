/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  moduleFileExtensions: ['ts', 'js', 'json', 'tsx', 'jsx', 'json', 'node'],
  moduleDirectories: ['node_modules', '<rootDir>'],

  preset: 'ts-jest',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [],
  collectCoverageFrom: ['./src/**/*.ts'],
  coveragePathIgnorePatterns: ['/node_modules/'],
  coverageThreshold: {
    global: {
      lines: 75,
    },
  },
  moduleNameMapper: {
    '\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/mocks/image-mock.js',
    '\\.(css|less)$': 'identity-obj-proxy',
    '@fontsource/inter': 'identity-obj-proxy',
  },
}
