import { stat } from "fs";
import { InventoryPage } from "../../page-objects/inventoryPage";
import {
  CartAction,
  CartState,
  InventoryItemData,
} from "../../utils/types/inventory-item";
import { User } from "../../utils/types/login";
import { transitionCartState } from "./cart-machine";
import { expect } from "@playwright/test";

export async function runCartScenario(
  inventoryPage: InventoryPage,
  user: User,
  actions: CartAction[],
): Promise<CartState> {
  let state: CartState = { count: 0, items: new Map() };

  for (const action of actions) {
    // --- perform UI action ---
    if (action.type === "ADD") {
      await inventoryPage.items.addItemToCart(action.title);
    } else {
      await inventoryPage.items.removeItemFromCart(action.title);
    }

    // --- update expected state ---
    state = transitionCartState(state, action, user);

    // --- assert observable state ---
    const badge = await inventoryPage.getCartBadgeCount();
    if (user.capabilities.cart.badgeAccurate) {
      expect(
        badge,
        `Cart badge after ${action.type} "${action.title}" (count=${state.count})`,
      ).toBe(state.count);
    }
  }
  console.log(
    `The state for user: ${user} is count: ${state.count} | items:`,
    Object.fromEntries(state.items),
  );
  console.log(
    `The state for user: ${user} | count: ${state.count}\n` +
      JSON.stringify(Object.fromEntries(state.items), null, 2),
  );

  return state;
}
