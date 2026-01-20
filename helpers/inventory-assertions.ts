import { expect } from "@playwright/test";
import {
  AssertionContext,
  InventoryItemData,
} from "../types/inventory-item";
import { User } from "../types/login";

// page agnostic because inventory items are located in different pages

function formatContext(ctx: AssertionContext): string {
  return `[${ctx.feature}] ${ctx.scenario} | user=${ctx.user}${
    ctx.item ? ` | item="${ctx.item}"` : ""
  }`;
}

export function assertTitle(
  actual: InventoryItemData,
  expected: InventoryItemData,
  context: AssertionContext
) {
  const message = formatContext(context) + `\n Assertion[Title]: \n Actual: ${actual.title} \n Expected: ${expected.title}`;

  expect(actual.title, message).toEqual(expected.title);
}

export function assertPrice(
  actual: InventoryItemData,
  expected: InventoryItemData,
  context: AssertionContext,
  user: User
) {
  const message = formatContext(context) + `\n Assertion[Price]: \n Actual: ${actual.price} \n Expected: ${expected.price}`;

  if (!user.capabilities.sort?.priceAccurate) {
    expect(actual.price, message).not.toEqual(expected.price);
  } else {
    expect(actual.price, message).toEqual(expected.price);
  }
}

export function assertDescription(
  actual: InventoryItemData,
  expected: InventoryItemData,
  context: AssertionContext
) {
  const message = formatContext(context) + `\n Assertion[Description]: \n Actual: ${actual.description} \n Expected: ${expected.description}`;
  expect(actual.description, message).toEqual(expected.description);
}

export function assertImgSrc(
  actual: InventoryItemData,
  expected: InventoryItemData,
  context: AssertionContext
) {
  const message = formatContext(context) + `\n Assertion[Image Source]: \n Actual: ${actual.imgSrc} \n Expected: ${expected.imgSrc}`;
  expect(actual.imgSrc, message).toEqual(expected.imgSrc);
}

export function assertBtnText(
  actual: InventoryItemData,
  expected: InventoryItemData,
  context: AssertionContext
) {
  const message = formatContext(context) + `\n Assertion[Button Text]: \n Actual: ${actual.buttonText} \n Expected: ${expected.buttonText}`;
  expect(actual.buttonText, message).toEqual(expected.buttonText);
}

