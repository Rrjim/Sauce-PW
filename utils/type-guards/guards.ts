import { BaseItemData, CartItemData, CheckoutItemData, InventoryItemData, OptionalFields } from "../types/inventory-item";
import { User } from "../types/login";

// --- Filter out succssful login users ---
export function isSuccessfulUser(user: User): user is User & { expect: "successful" } {
  return user.expect === "successful";
}

export function isUnsuccessfulUser(user: User): user is User & { expect: "unsuccessful" } {
  return user.expect === "unsuccessful";
}

export function hasButtonText<T extends BaseItemData & OptionalFields>(
  item: T
): item is T & { buttonText: string } {
  return typeof item.buttonText === "string";
}

export function hasImage<T extends BaseItemData & OptionalFields>(
  item: T
): item is T & { imgSrc: string } {
  return typeof item.imgSrc === "string";
}

