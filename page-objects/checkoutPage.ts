// page-objects/inventoryPage.ts
import { BasePage } from "./basePage";
import urls from "../test-data/url/urls.qa.json";
import { CheckoutFormData } from "../utils/types/checkout";
import { CheckoutOverviewPage } from "./checkoutOverview.Page";

export class CheckoutPage extends BasePage {
  url = urls.checkout;
  pageReadyLocator = this.page.locator("[data-test='title']");
  readonly firstName = this.page.locator("[data-test='firstName']");
  readonly lastName = this.page.locator("[data-test='lastName']");
  readonly postCode = this.page.locator("[data-test='postalCode']");
  readonly cancelButton = this.page.getByRole("button", { name: "cancel" });
  readonly continueButton = this.page.locator("[data-test='continue']");

  async fillForm(data: CheckoutFormData): Promise<void> {
    await this.firstName.fill(data.firstName);
    await this.lastName.fill(data.lastName);
    await this.postCode.fill(data.postalCode);
  }

  async getFieldValues(): Promise<CheckoutFormData> {
    return {
      firstName: await this.firstName.inputValue(),
      lastName: await this.lastName.inputValue(),
      postalCode: await this.postCode.inputValue(),
    };
  }

  async submit(): Promise<CheckoutOverviewPage> {
    await this.continueButton.click();
    return this.pageManager.onCheckoutOverviewPage()
  }
}
