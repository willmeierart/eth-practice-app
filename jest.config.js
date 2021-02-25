const enzyme = require.resolve("./test/enzyme");

const coverageEnabled = process.argv.indexOf("--coverage") !== -1;

module.exports = {
  clearMocks: true,
  collectCoverage: coverageEnabled,
  collectCoverageFrom: ["components", "data", "lib", "redux/actions.js"],
  coverageDirectory: "./coverage",
  coverageReporters: ["json-summary", "text-lcov", "lcov"],
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
  setupFiles: [enzyme],
  testURL: "http://localhost/",
  transform: { "^.+\\.(js|jsx|mjs)$": "<rootDir>/node_modules/babel-jest" },
};
