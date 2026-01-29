
export interface InventoryItemData {
  title: string;
  description: string;
  price: string;
  imgSrc: string;
  buttonText: string;
}

export interface CartItemData {
  title: string;
  description: string;
  price: string;
  buttonText: string;
  quantity: number;
}

export interface CheckoutItemData {
  title: string;
  description: string;
  price: string;
  quantity: number;
}

export interface BaseItemData {
  title: string;
  description: string;
  price: string;
}

export type OptionalFields = {
  imgSrc?: string | null;
  buttonText?: string | null;
};

export type PriceScope = "checkout" | "unstable";


export type SortableField = "title" | "price";

interface SortByOption {
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

export interface CartState {
  count: number;
  items: Map<string, number>; // title, quantity pairs
}

// Union => one of those types
export type CartAction =
  | { type: "ADD"; title: string }
  | { type: "REMOVE"; title: string };

// export type ItemAssertion = (
//   actual: InventoryItemData,
//   expected: InventoryItemData,
//   context: AssertionContext,
//   user: User
// ) => void;

export interface AssertionContext {
  feature: "Inventory" | "Sorting" | "Cart";
  scenario: string; // e.g. "Default", "Sort: az"
  user: string;
  item?: string;
}


export interface HasItemList<D> {
  items: {
    getData(): Promise<Record<string, D>>;
  };
}
