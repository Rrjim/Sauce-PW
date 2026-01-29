import { UserMap } from "../../utils/types/login";
import { test } from "../../fixtures/test-options";
import userData from "../../test-data//user/users.qa.json";
import {
  performLoginFlow,
} from "../../helpers/login";
import { validateInventoryIntegrity } from "../../helpers/inventory-validate";
import { runCartScenario } from "../../helpers/state-machines/cart-runner";
import {
  buildAddOnlyCartScenario,
  getExpectedCartItems,
} from "../../helpers/cart";
import { assertCartQuantities } from "../../helpers/cart-quantity-assertions";
import {
  buildCheckoutInput,
  runCheckoutFormFlow,
} from "../../helpers/checkout-data";
import { isSuccessfulUser } from "../../utils/type-guards/guards";

const users = userData as UserMap;

test.describe("Cart - Cart behavior", () => {
  Object.entries(users).forEach(([key, user]) => {
    if (!isSuccessfulUser(user)) return;
    test(`Cart items integrity ${key}`, async ({ pageManager }) => {
      const inventoryPage = await performLoginFlow(pageManager, user, key);

      const addActions = buildAddOnlyCartScenario(user, key);

      const finalState = await runCartScenario(inventoryPage, user, addActions);

      const expected = await getExpectedCartItems(inventoryPage, addActions);

      const cartPage = await inventoryPage.goToCart();

      await validateInventoryIntegrity(cartPage, user, expected, {
        feature: "Inventory",
        scenario: "Integrity",
        user: key,
      });

      await assertCartQuantities(cartPage, finalState, `user=${key}`);
    });
  });
});

test.describe("Cart - Cart checkout form", () => {
  Object.entries(users).forEach(([key, user]) => {
    // .filter(([_, u]) => u.expect === "successful")
    // .forEach(([key, user]) => {
    if (!isSuccessfulUser(user)) return;
    test(`Cart items checkout for ${key}`, async ({ pageManager }) => {
      const inventoryPage = await performLoginFlow(pageManager, user, key);

      const addActions = buildAddOnlyCartScenario(user, key);

      await runCartScenario(inventoryPage, user, addActions);

      const cartPage = await inventoryPage.goToCart();

      const checkoutPage = await cartPage.goToCheckout();
      const input = buildCheckoutInput();
      const checkoutOverviewPage = await runCheckoutFormFlow(
        checkoutPage,
        user,
        input,
      );
    });
  });
});

test.describe("Cart - Cart finish checkout", () => {
  Object.entries(users).forEach(([key, user]) => {
    // .filter(
    //   ([_, u]) =>
    //     u.expect === "successful" &&
    //     u.capabilities.checkout.lastNameAvailableForInput &&
    //     u.capabilities.checkout.lastNameRequired,
    // )
    if (
      (!isSuccessfulUser(user) ||
      user.capabilities.checkout.lastNameOverwritesFirstName) 
    )
      return;
    test(`Cart finish checkout for ${key}`, async ({ pageManager }) => {
      const inventoryPage = await performLoginFlow(pageManager, user, key);

      const addActions = buildAddOnlyCartScenario(user, key);

      await runCartScenario(inventoryPage, user, addActions);

      const cartPage = await inventoryPage.goToCart();

      const expected = await getExpectedCartItems(cartPage, addActions);

      const checkoutOverviewPage = await cartPage
        .goToCheckout()
        .then((checkout) =>
          runCheckoutFormFlow(checkout, user, buildCheckoutInput()),
        );

      await validateInventoryIntegrity(checkoutOverviewPage, user, expected, {
        feature: "Inventory",
        scenario: "Integrity",
        user: key,
      });

      await checkoutOverviewPage.assertTotalsMatch(expected, user);
      await checkoutOverviewPage.finish();
    });
  });
});
