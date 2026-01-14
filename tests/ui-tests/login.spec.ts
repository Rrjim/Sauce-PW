import { argosScreenshot } from "@argos-ci/playwright";
import { test } from "../../fixtures/test-options";
import userData from "../../test-data/users.qa.json";
import { Users } from "../../types/login";
import { stepWithArgos } from "../../helpers/argos"; // our fixed helper

const users = userData as Users;

test.describe("Login scenarios", () => {
  for (const [key, userRecord] of Object.entries(users)) {
    test(`${key} login is ${userRecord.expect}`, async ({ pageManager }) => {
      const loginPage = pageManager.onLoginPage();
      const inventoryPage = pageManager.onInventoryPage();
      const page = pageManager.getPage();

      const password =
        process.env[userRecord.passwordKey] ?? userRecord.passwordKey;

      // --- login step ---
      await stepWithArgos(page, `Login Step - ${key}`, async () => {
        await loginPage.open();
        await loginPage.isPageLoaded();
        await loginPage.login(userRecord.username, password);
      });
      
      // --- verification step ---
      await stepWithArgos(page, `Verify Result - ${key}`, async () => {
        const assertions = {
          successful: async () => {
            await inventoryPage.assertPageUrl();
            await inventoryPage.isPageLoaded();
          },
          unsuccessful: async () => {
            await loginPage.expectError(userRecord.errorText!);
          },
        };

        await assertions[userRecord.expect]();
      });
    });
  }
});
