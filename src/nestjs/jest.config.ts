export default {
    displayName: {
        name: "nestjs",
        color: 'magentaBright'
    },
    moduleFileExtensions: [
        "js",
        "json",
        "ts"
    ],
    rootDir: "src",
    testRegex: ".*\\.spec\\.ts$",
    transform: {
        "^.+\\.(t|j)s$": "@swc/jest"
    },
    collectCoverageFrom: [
        "**/*.(t|j)s"
    ],
    coverageDirectory: "../coverage",
    testEnvironment: "node",
     moduleNameMapper: {
        'mycore/(.*)': '<rootDir>/../../../node_modules/mycore/dist/$1',
    } 
}