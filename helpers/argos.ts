import { Page } from "@playwright/test";
import { argosScreenshot } from "@argos-ci/playwright";

/**
 * Wrap a step and take Argos screenshot if it throws
 */
export async function stepWithArgos(
  page: Page,
  snapshotName: string,
  fn: () => Promise<void>
) {
  try {
    await fn(); // run the actual step
  } catch (err) {
    // Step failed → take screenshot immediately
    await argosScreenshot(page, snapshotName);
    throw err; // rethrow so test still fails
  }
}
