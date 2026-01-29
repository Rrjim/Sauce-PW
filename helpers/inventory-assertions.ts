import { expect } from "@playwright/test";
import {
  AssertionContext,
  PriceScope,
} from "../utils/types/inventory-item";
import { User } from "../utils/types/login";

// Helper to format test context for better messages
function formatContext(ctx: AssertionContext): string {
  return `[${ctx.feature}] ${ctx.scenario} | user=${ctx.user}${
    ctx.item ? ` | item="${ctx.item}"` : ""
  }`;
}

// Generic property assertion
export function assertProperty(
  actual: string | null | undefined,
  expected: string | null | undefined,
  context: AssertionContext,
  propertyName: string
) {
  // Only assert if the property exists (non-null/undefined)
  if (actual != null && expected != null) {
    const message = `${formatContext(context)}\n Assertion[${propertyName}]:\n Actual: ${actual}\n Expected: ${expected}`;
    console.log(`Actual: ${actual} \nExpected: ${expected}`)
    expect(actual, message).toEqual(expected);
  }
}

// Title
export function assertTitle(
  actual: string,
  expected: string,
  context: AssertionContext
) {
  assertProperty(actual, expected, context, "Title");
}

// Description
export function assertDescription(
  actual: string,
  expected: string,
  context: AssertionContext
) {
  assertProperty(actual, expected, context, "Description");
}

// Price (special handling for unstable scope & user capabilities)
export function assertPrice(
  actual: string,
  expected: string,
  context: AssertionContext,
  user: User,
  scope: PriceScope
) {
  const message = `${formatContext(context)}\n Assertion[Price]:\n Actual: ${actual}\n Expected: ${expected}`;

  if (scope === "unstable" && !user.capabilities.sort.priceAccurate) {
    expect(actual, message).not.toEqual(expected);
  } else {
    expect(actual, message).toEqual(expected);
  }
}

// Image source (only for InventoryItemData)
export function assertImgSrc(
  actual: string,
  expected: string,
  context: AssertionContext
) {
  assertProperty(actual, expected, context, "Image Source");
}

// Button text (InventoryItemData or CartItemData)
export function assertBtnText(
  actual: string,
  expected: string,
  context: AssertionContext
) {
  assertProperty(actual, expected, context, "Button Text");
}

// Example usage in validation loop:
//
// for (const title of Object.keys(expected)) {
//   const itemCtx: AssertionContext = { ...context, item: title };
//   const a = actual[title];
//   const e = expected[title];
//
//   assertTitle(a.title, e.title, itemCtx);
//   assertDescription(a.description, e.description, itemCtx);
//   assertPrice(a.price, e.price, itemCtx, user, scope);
//
//   if ("imgSrc" in a && "imgSrc" in e) {
//     assertImgSrc(a, e, itemCtx);
//   }
//   if ("buttonText" in a && "buttonText" in e) {
//     assertBtnText(a, e, itemCtx);
//   }
// }
