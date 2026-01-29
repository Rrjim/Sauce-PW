import { CheckoutPage } from "../page-objects/checkoutPage";
import { CheckoutFormData } from "../utils/types/checkout";
import { User } from "../utils/types/login";
import { randomNumericText, randomText } from "../utils/data/random";
import { assertCheckoutBehavior, assertCheckoutValidation } from "./checkout-assertions";

export async function runCheckoutFormFlow(
  checkoutPage: CheckoutPage,
  user: User,
  input: CheckoutFormData
) {
  await checkoutPage.fillForm(input);
  const actual = await checkoutPage.getFieldValues();
  const checkoutOverviewPage = await checkoutPage.submit();

  await assertCheckoutValidation(user, checkoutPage);
  assertCheckoutBehavior(user, input, actual);

  return checkoutOverviewPage;
}

export function buildCheckoutInput(
  overrides: Partial<CheckoutFormData> = {}
): CheckoutFormData {
  return {
    firstName: overrides.firstName ?? randomText({ length: 5 }),
    lastName: overrides.lastName ?? randomText({ length: 5 }),
    postalCode: overrides.postalCode ?? randomNumericText({ digits: 5 }),
  };
}
