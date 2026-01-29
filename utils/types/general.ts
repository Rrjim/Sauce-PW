import { CartPage } from "../../page-objects/cartPage"
import { CheckoutOverviewPage } from "../../page-objects/checkoutOverview.Page"
import { CheckoutPage } from "../../page-objects/checkoutPage"
import { InventoryPage } from "../../page-objects/inventoryPage"
import { LoginPage } from "../../page-objects/loginPage"
import { CartItemData, CheckoutItemData, InventoryItemData } from "./inventory-item"

export interface PageManagerType {
  onLoginPage(): LoginPage
  onInventoryPage(): InventoryPage
  onCartPage(): CartPage
  onCheckoutPage(): CheckoutPage
  onCheckoutOverviewPage(): CheckoutOverviewPage
}


export type PageItem<P> =
  P extends ItemPage<infer T> ? T : never;


export interface ItemPage<T> {
  items: {
    getData(): Promise<Record<string, T>>;
  };
}

export type InventoryPage = ItemPage<InventoryItemData>;
export type CartPage = ItemPage<CartItemData>;
export type CheckoutPage = ItemPage<CheckoutItemData>;

export type Normalized<T> = T & {
  imgSrc: string | null;
  buttonText: string | null;
  quantity?: number;
};

