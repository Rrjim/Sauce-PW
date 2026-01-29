import { CartPage } from "../../page-objects/cartPage"
import { CheckoutOverviewPage } from "../../page-objects/checkoutOverview.Page"
import { CheckoutPage } from "../../page-objects/checkoutPage"
import { ItemList } from "../../page-objects/components/list/itemList"
import { InventoryPage } from "../../page-objects/inventoryPage"
import { LoginPage } from "../../page-objects/loginPage"
import { BaseItemData, CartItemData, CheckoutItemData, InventoryItemData } from "./inventory-item"

export interface PageManagerType {
  onLoginPage(): LoginPage
  onInventoryPage(): InventoryPage
  onCartPage(): CartPage
  onCheckoutPage(): CheckoutPage
  onCheckoutOverviewPage(): CheckoutOverviewPage
}


export type PageItem<P> =
  P extends ItemPage<infer T> ? T : never;


export interface ItemPage<T extends BaseItemData> {
  items: ItemList<any, T>
}

export type Normalized<T> = T & {
  imgSrc: string | null;
  buttonText: string | null;
  quantity?: number;
};

