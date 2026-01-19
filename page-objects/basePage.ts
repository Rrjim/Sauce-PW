import { Page, Locator, expect } from "@playwright/test";

export abstract class BasePage {
  protected readonly page: Page;
  protected abstract readonly url: string;
  protected abstract readonly pageReadyLocator: Locator;

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

  /**
   * Overwrite to provide custom snapshot name/path
   * @param snapshotName 
   * @param options 
   *
   */
  async visualAssert(
    snapshotName: string,
    options?: { maxDiffPixels?: number }
  ) {
    await expect(this.page).toHaveScreenshot(snapshotName, {
      maxDiffPixels: options?.maxDiffPixels ?? 150,
      animations: "disabled",
      caret: "hide",
    });
  }

  // --- Abstract method ---
  // If a page has extra checks (like multiple key elements), it can implement this
  // abstract assertPageReady(): Promise<void>;
}
