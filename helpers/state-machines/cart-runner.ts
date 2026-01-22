import { InventoryPage } from "../../page-objects/inventoryPage";
import { CartAction, CartState, InventoryItemData } from "../../types/inventory-item";
import { User } from "../../types/login";
import { readDataFromFile } from "../general";
import { getCartTestItems } from "../inventory";
import { transitionCartState } from "./cart-machine";
import { expect } from "@playwright/test";

export async function runCartScenario(
  inventoryPage: InventoryPage,
  user: User,
  actions: CartAction[]
) {
  let state: CartState = { count: 0, items: new Set() };

  for (const action of actions) {
    // --- perform UI action ---
    if (action.type === "ADD") {
      await inventoryPage.addItemToCart(action.title);
    } else {
      await inventoryPage.removeItemFromCart(action.title);
    }

    // --- update expected state ---
    state = transitionCartState(state, action, user);

    // --- assert observable state ---
    const badge = await inventoryPage.getCartBadgeCount();
    if (user.capabilities.cart.badgeAccurate) {
      expect(
        badge,
        `Cart badge after ${action.type} "${action.title}" (count=${state.count})`
      ).toBe(state.count);
    }
  }
}
