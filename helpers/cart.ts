// test-helpers/cart/cart-scenarios.ts

import { CartAction } from "../types/inventory-item";


export const fullCartLifecycle = (titles: string[]): CartAction[] => [
  ...titles.map((title): CartAction => ({ type: "ADD", title })),
  ...titles.map((title): CartAction => ({ type: "REMOVE", title })),
];

// OR  [As const ensures that type will remain ADD and won't be changed]

// export const fullCartLifecycle = (titles: string[]): CartAction[] => [
//   ...titles.map((title) => ({ type: "ADD" as const, title })),
//   ...titles.map((title) => ({ type: "REMOVE" as const, title })),
// ];




