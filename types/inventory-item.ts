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


export type SortMapping = Readonly<Record<SortKey, SortByOption | null>>

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
