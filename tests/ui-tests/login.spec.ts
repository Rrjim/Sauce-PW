import { argosScreenshot } from "@argos-ci/playwright";
import { test } from "../../fixtures/test-options";
import userData from "../../test-data/user/users.qa.json";
import { UserMap } from "../../types/login";

const users = userData as UserMap;

test.describe("Login scenarios", () => {
  for (const [key, userRecord] of Object.entries(users)) {
    test(`${key} login is ${userRecord.expect}`, async ({ pageManager }) => {
      const loginPage = pageManager.onLoginPage();
      const inventoryPage = pageManager.onInventoryPage();
      const page = pageManager.getPage();

      const password =
        process.env[userRecord.passwordKey] ?? userRecord.passwordKey;

      // --- login step ---
      await loginPage.open();
      await loginPage.isPageLoaded();
      await loginPage.login(userRecord.username, password);

      // --- verification step ---
      const assertions = {
        successful: async () => {
          await inventoryPage.assertPageUrl();
          await inventoryPage.isPageLoaded();
          // if (userRecord.username === "visual_user") return; // skip visual check for visual_user
          // await inventoryPage.visualAssert(`Login Scenarios - ${key}`);
          await inventoryPage.generateInventoryDatasetByUser(key);

          await argosScreenshot(page, `Login Scenarios - ${key}`);
        },
        unsuccessful: async () => {
          await loginPage.expectError(userRecord.errorText!);
          // await loginPage.visualAssert(`Login Scenarios - ${key}`);
          await argosScreenshot(page, `Login Scenarios - ${key}`);
        },
      };
      await assertions[userRecord.expect]();
    });
  }
});
