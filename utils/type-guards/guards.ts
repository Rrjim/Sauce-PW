import { CartItemData, CheckoutItemData, InventoryItemData } from "../types/inventory-item";
import { User } from "../types/login";

// --- Filter out succssful login users ---
export function isSuccessfulUser(user: User): user is User & { expect: "successful" } {
  return user.expect === "successful";
}

export function isUnsuccessfulUser(user: User): user is User & { expect: "unsuccessful" } {
  return user.expect === "unsuccessful";
}

export function hasImage(
  item: InventoryItemData | CartItemData | CheckoutItemData
): item is InventoryItemData & { imgSrc: string } {
  return "imgSrc" in item && typeof item.imgSrc === "string";
}

export function hasButtonText(
  item: InventoryItemData | CartItemData | CheckoutItemData
): item is InventoryItemData | CartItemData {
  return "buttonText" in item && typeof item.buttonText === "string";
}
