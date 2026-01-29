import { InventoryPage } from "../../page-objects/inventoryPage"
import { LoginPage } from "../../page-objects/loginPage"

export interface PageManagerType {
  onLoginPage(): LoginPage
  onInventoryPage(): InventoryPage
}
