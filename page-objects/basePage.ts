import { Page, Locator, expect } from "@playwright/test";
import { PageManager } from "./pageManager";

export abstract class BasePage {
  protected readonly page: Page;
  protected readonly pageManager: PageManager
  protected abstract readonly url: string;
  protected abstract readonly pageReadyLocator: Locator;
  protected readonly errorMessage: Locator

  constructor(page: Page, pageManager: PageManager) {
    this.page = page
    this.pageManager = pageManager
    this.errorMessage = this.page.locator('[data-test="error"]')
  }

  async open() {
    await this.page.goto(this.url);
    await this.assertPageLoaded();
  }

  async assertPageLoaded() {
    await expect(this.pageReadyLocator).toBeVisible();
  }

  async assertPageUrl() {
    await expect(this.page).toHaveURL(this.url);
  }

  async expectError(text: string) {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toHaveText(text);
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

  async handlePageAlert(): Promise<void> {
    this.page.once("dialog", async (dialog: any) => {
      await dialog.accept();
    });
  }

  // --- Abstract method ---
  // If a page has extra checks (like multiple key elements), it can implement this
  // abstract assertPageReady(): Promise<void>;
}
