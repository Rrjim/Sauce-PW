// test-helpers/cart/cart-quantity-assertions.ts
import { expect } from "@playwright/test";
import { CartState } from "../utils/types/inventory-item";
import { CartPage } from "../page-objects/cartPage";

export async function assertCartQuantities(
  cartPage: CartPage,
  expected: CartState,
  context: string
) {
  const actual = await cartPage.getItemQuantities();

  const expectedEntries = [...expected.items.entries()];

  expect(
    Object.keys(actual),
    `[Cart] Items present | ${context}`
  ).toEqual(expectedEntries.map(([title]) => title));

  for (const [title, qty] of expectedEntries) {
    expect(
      actual[title],
      `[Cart] Quantity for "${title}" | ${context}`
    ).toBe(qty);
  }
}
