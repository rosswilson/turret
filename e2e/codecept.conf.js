const { setHeadlessWhen } = require("@codeceptjs/configure");
const { bootstrap, teardown } = require("./bootstrap");

// turn on headless mode when running with HEADLESS=true environment variable
// HEADLESS=true npx codecept run
setHeadlessWhen(process.env.HEADLESS);

const chromePath = process.env.USE_BUNDLED_CHROME
  ? undefined
  : "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

exports.config = {
  tests: "./*_test.js",
  output: "./output",
  helpers: {
    Puppeteer: {
      url: "https://turret.localhost:3000",
      show: true,
      windowSize: "1200x900",
      chrome: {
        ignoreHTTPSErrors: true,
        executablePath: chromePath,
      },
    },
  },
  include: {
    I: "./steps_file.js",
  },
  bootstrap,
  teardown,
  mocha: {},
  name: "turret",
  plugins: {
    retryFailedStep: {
      enabled: true,
    },
    screenshotOnFail: {
      enabled: true,
    },
  },
};
