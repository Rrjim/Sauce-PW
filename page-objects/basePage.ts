import { Page, Locator, expect } from "@playwright/test";

export abstract class BasePage {
  protected readonly page: Page;
  protected abstract readonly url: string;
  protected abstract readonly pageReadyLocator: Locator;
  protected abstract readonly visualAssertForm: Locator;
  protected abstract readonly snapshotPath?: string;

  constructor(page: Page) {
    this.page = page;
  }

  async open() {
    await this.page.goto(this.url);
    await this.isPageLoaded();
  }

  async isPageLoaded() {
    await expect(this.pageReadyLocator).toBeVisible();
  }

  async assertPageUrl() {
    await expect(this.page).toHaveURL(this.url);
  }

  async visualAssert() {
    await expect(this.page).toHaveScreenshot();
  }

  // --- Abstract method ---
  // If a page has extra checks (like multiple key elements), it can implement this
  // abstract assertPageReady(): Promise<void>;
}
