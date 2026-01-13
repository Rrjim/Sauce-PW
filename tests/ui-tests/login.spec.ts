import { argosScreenshot } from "@argos-ci/playwright";
import { test } from "../../fixtures/test-options";
import userData from "../../test-data/users.qa.json";
import { Users } from "../../types/login";
import { log } from "console";

const users = userData as Users;

test.describe("Login scenarios", () => {
  for (const [key, userRecord] of Object.entries(users)) {
    test(`${key} login is ${userRecord.expect}`, async ({ pageManager }) => {
      const loginPage = pageManager.onLoginPage();
      const inventoryPage = pageManager.onInventoryPage();

      const password =
        process.env[userRecord.passwordKey] ?? userRecord.passwordKey;

      await loginPage.open();
      await loginPage.isPageLoaded();
      await loginPage.login(userRecord.username, password);

      await test.step("Verify result", async () => {
        const assertions = {
          successful: async () => {
            // inventoryPage.assertPageUrl();
            inventoryPage.isPageLoaded();
            await argosScreenshot(pageManager.getPage(), "Inventory Page - " + key);
          },
          unsuccessful: async () => {
            loginPage.expectError(userRecord.errorText!), // Non-null assertion as errorText is required for unsuccessful logins, it is going to be generated at runtime
              await argosScreenshot(
                pageManager.getPage(),
                "Login Page - " + key
              );
          },
        };
        await assertions[userRecord.expect]();
      });
    });
  }
});
