import { expect } from "@playwright/test";
import { InventoryItemData } from "../types/inventory-item";
import { User } from "../types/login";

// page agnostic because inventory items are located in different pages
export type ItemAssertion = (
  actual: InventoryItemData,
  expected: InventoryItemData,
  context: string,
  user: User
) => void;

export const assertItemExists = (
  actual: InventoryItemData | undefined,
  title: string,
  context: string
) => {
  expect(actual, `${context} → missing item "${title}"`).toBeTruthy();
};

export const assertPrice: ItemAssertion = (
  actual,
  expected,
  context,
  user
) => {
  const allowMismatch = !user.capabilities.sort?.priceAccurate;

  if (allowMismatch) {
    expect(actual.price, context).not.toEqual(expected.price);
  } else {
    expect(actual.price, context).toEqual(expected.price);
  }
};

export const assertDescription: ItemAssertion = (
  actual,
  expected,
  context
) => {
  expect(actual.description, context).toEqual(expected.description);
};

export const assertImgSrc: ItemAssertion = (
  actual,
  expected,
  context
) => {
  expect(actual.imgSrc, context).toEqual(expected.imgSrc);
};

export const assertBtnText: ItemAssertion = (
  actual,
  expected,
  context
) => {
  expect(actual.buttonText, context).toEqual(expected.buttonText);
};
