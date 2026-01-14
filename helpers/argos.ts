import { Page } from "@playwright/test";
import { argosScreenshot } from "@argos-ci/playwright";
import { test as baseTest } from "../fixtures/test-options";

/**
 * Wraps an async test step and takes an Argos screenshot on failure automatically.
 * @param page Playwright page
 * @param snapshotName Argos snapshot name
 * @param fn Async function containing the step logic
 */
export async function stepWithArgos(
  page: Page,
  snapshotName: string,
  fn: () => Promise<void>
) {
  try {
    await fn();
  } finally {
    const info = baseTest.info();
    if (info.status === "failed") {
      await argosScreenshot(page, snapshotName);
    }
  }
}
