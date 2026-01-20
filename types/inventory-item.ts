import { User } from "./login";

export interface InventoryItemData {
  title: string;
  description: string;
  price: string;
  imgSrc: string | null;
  buttonText: string;
}

type SortableField = "title" | "price";

export interface SortByOption {
  field: SortableField;
  descending: boolean;
}

export type SortMapping = Readonly<Record<SortKey, SortByOption | null>>;

export type SortKey = "default" | "az" | "za" | "lohi" | "hilo";

// Assert with sorting options
export const sortMapping: SortMapping = {
  default: null,
  az: { field: "title", descending: false },
  za: { field: "title", descending: true },
  lohi: { field: "price", descending: false },
  hilo: { field: "price", descending: true },
};

export type CartState = {
  count: number;
  items: Set<string>;
};

export type CartAction =
  | { type: "ADD"; title: string }
  | { type: "REMOVE"; title: string };

export type ItemAssertion = (
  actual: InventoryItemData,
  expected: InventoryItemData,
  context: AssertionContext,
  user: User
) => void;

export interface AssertionContext {
  feature: "Inventory" | "Sorting" | "Cart";
  scenario: string; // e.g. "Default", "Sort: az"
  user: string;
  item?: string;
}
