import { defineConfig, devices } from "@playwright/test";
import * as dotenv from "dotenv";
import type { TestOptions } from "./test-options";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
dotenv.config();
const users = JSON.parse(process.env.USERS_JSON || "{}");
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig<TestOptions>({
  timeout: 40000,
  // globalTimeout: 60000,
  expect: {
    timeout: 10000,
    toMatchSnapshot: { maxDiffPixels: 150 },
  },
  // testDir: './tests', // DEFAULT VALUE CAN BE REMOVED
  /* Run tests in files in parallel */
  fullyParallel: false, // DEFAULT VALUE CAN BE REMOVED
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  // forbidOnly: !!process.env.CI, // DEFAULT VALUE CAN BE REMOVED
  /* Retry on CI/CD pipeline only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined, // DEFAULT VALUE CAN BE REMOVED
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    process.env.CI ? ["dot"] : ["list"],
    [
      "@argos-ci/playwright/reporter",
      {
        // Upload to Argos on CI only./
        uploadToArgos: !!process.env.CI,

        // Set your Argos token (required if not using GitHub Actions).
        token: process.env.ARGOS_TOKEN,

      },
    ],
    ["json", { outputFile: "test-results/jsonReport.json" }],
    ["junit", { outputFile: "test-results/junitReport.xml" }],
    // ['allure-playwright'],
    // block html reporter from opening automatically as it might block copilot
    ["html", { open: "never" }],
  ],
  // ALLURE SETUP
  // npm install -g allure-commandline
  // allure generate allure-results -o allure-report --clean
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    // baseURL: 'http://localhost:4200',
    globalsQaURL: "https://www.globalsqa.com/demo-site/draganddrop/",
    // baseURL is used for UI apps as well, we use api-config for API
    baseURL: process.env.BASE_URL,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    // trace is responsible for taking screenshots when a test fails (UI only)
    trace: "retain-on-failure",
    // API useful "use" for http requests
    // NOTE if we specify extraHTTP/ httpCredentials in projects, it will overwright the global scope
    // extraHTTP is not the best practice, since all the calls must include these headers
    // extraHTTPHeaders: {
    //   Authorization: 'Token sakdsakdsajdsajdjawaiewjqijr'
    // },
    // httpCredentials: {
    //   username: '',
    //   password: ''
    // }
    actionTimeout: 10000,
    navigationTimeout: 15000,
    video: {
      mode: "off",
      size: { width: 1920, height: 1080 },
    },
    // viewport: { width: 1920, height: 1080 },
    
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "ui-tests",
      testDir: "./tests/ui-tests",
      use: {
        browserName: "chromium",
        actionTimeout: 10000,
        navigationTimeout: 10000,
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 1,
        launchOptions: {
          args: [
            "--disable-font-subpixel-positioning",
            "--disable-lcd-text",
          ],
        },
      },
      
  
},

  
    // {
    //   name: "firefox",
    //   use: {
    //     browserName: "firefox",
    //     video: {
    //       mode: "off",
    //       size: { width: 1920, height: 1080 },
    //     },
    //   },
    //   fullyParallel: true,
    // },

    // {
    //   name: "pageObjectFullScreen",
    //   testMatch: "usePageObjects.spec.ts",
    //   use: {
    //     viewport: {
    //       width: 1920,
    //       height: 1080,
    //     },
    //   },
    // },

    {
      name: "mobile",
      testMatch: "**/testMobile.spec.ts",
      use: {
        browserName: "webkit",
        ...devices["iPhone 15 Pro"],
      },
    },

    {
      name: "api-testing",
      testDir: "./tests/api-tests",
      dependencies: ["api-smoke-tests"],
    },

    {
      name: "api-smoke-tests",
      testDir: "./tests/api-tests",
      testMatch: "example*",
    },
  ],
  // // WebServer launches the app (only for UI)
  // webServer: {
  //   command: "npm run start", // your dev server
  //   url: "http://localhost:4200",
  //   reuseExistingServer: true, // attach if already running
  //   timeout: 120_000,
  // },
});
