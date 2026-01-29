import { test } from "../../fixtures/test-options";
import userData from "../../test-data/user/users.qa.json";
import { UserMap } from "../../utils/types/login";
import { performLoginFlow } from "../../helpers/login";
import { isSuccessfulUser, isUnsuccessfulUser } from "../../utils/type-guards/guards";

const users = userData as UserMap;

test.describe("Login scenarios", () => {
  for (const [key, userRecord] of Object.entries(users)) {
    test(`${key} login is ${userRecord.expect}`, async ({ pageManager }) => {
      if (isSuccessfulUser(userRecord)) {
        // TS knows this is a successful user now
        await performLoginFlow(
          pageManager,
          userRecord,
          key
        );

        // You can continue using inventoryPage as InventoryPage
        // e.g., assert page loaded, take screenshot, generate data, etc.
      } else if(isUnsuccessfulUser(userRecord)){
        // TS knows this is an unsuccessful user now
        await performLoginFlow(
          pageManager,
          userRecord,
          key
        );

      }
    });
  }
});
