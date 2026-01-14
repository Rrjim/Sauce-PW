import { test } from "../../fixtures/test-options";
import userData from "../../test-data/users.qa.json";
import { Users } from "../../types/login";
import { stepWithArgos } from "../../helpers/argos";

const users = userData as Users;

test.describe("Login scenarios", () => {
  for (const [key, userRecord] of Object.entries(users)) {
    test(`${key} login is ${userRecord.expect}`, async ({ pageManager }) => {
      const loginPage = pageManager.onLoginPage();
      const inventoryPage = pageManager.onInventoryPage();
      const page = pageManager.getPage();

      const password =
        process.env[userRecord.passwordKey] ?? userRecord.passwordKey;

      await loginPage.open();
      await loginPage.isPageLoaded();
      await loginPage.login(userRecord.username, password);

      await stepWithArgos(
        page,
        `${userRecord.expect === "successful" ? "Inventory" : "Login"} Page - ${key}`,
        async () => {
          // Assertions inside the wrapped step
          if (userRecord.expect === "successful") {
            await inventoryPage.assertPageUrl();
            await inventoryPage.isPageLoaded();
          } else {
            await loginPage.expectError(userRecord.errorText!);
          }
        }
      );
    });
  }
});
