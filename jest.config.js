const enzyme = require.resolve("./test/enzyme");

const coverageEnabled = process.argv.indexOf("--coverage") !== -1;

module.exports = {
  clearMocks: true,
  collectCoverage: coverageEnabled,
  collectCoverageFrom: [
    "components",
    "lib",
    "redux/actions.js",
    "redux/reducers.js",
  ],
  coverageDirectory: "./coverage",
  coverageReporters: ["json-summary", "text-lcov", "lcov"],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  setupFiles: [enzyme],
  testURL: "http://localhost/",
  transform: { "^.+\\.(js|jsx|mjs)$": "<rootDir>/node_modules/babel-jest" },
};
