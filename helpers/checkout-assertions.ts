// test-helpers/checkout/checkout-assertions.ts
import { expect } from "@playwright/test";
import { User } from "../utils/types/login";
import { CheckoutFormData } from "../utils/types/checkout";
import { CheckoutPage } from "../page-objects/checkoutPage";

export function assertCheckoutBehavior(
  user: User,
  input: CheckoutFormData,
  actual: CheckoutFormData
) {
  const caps = user.capabilities.checkout;

  // --- Last name not available ---
  if (!caps.lastNameAvailableForInput) {
    expect(
      actual.lastName,
      "Last name should be ignored when input is unavailable"
    ).toBe("");
  }

  // --- Last name overwrites first name (first char only) ---
  if (caps.lastNameOverwritesFirstName) {
    expect(
      actual.firstName,
      "First name should be first character of last name"
    ).toBe(input.lastName);

    expect(
      actual.lastName,
      "Last name should be cleared after overwrite"
    ).toBe("");
  }

  // --- Default behavior ---
  if (
    caps.lastNameAvailableForInput &&
    !caps.lastNameOverwritesFirstName
  ) {
    expect(actual.firstName).toBe(input.firstName);
    expect(actual.lastName).toBe(input.lastName);
  }
}

export async function assertCheckoutValidation(
  user: User,
  checkoutPage: CheckoutPage
) {
  const caps = user.capabilities.checkout;

  if (caps.lastNameRequired && !caps.lastNameAvailableForInput) {
    await checkoutPage.expectError(`Error: Last Name is required`)
  }
}