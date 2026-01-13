// /utils/LocatorManager.ts

type LocatorMap = Record<string, Record<string, string>>;

/**
 * LocatorManager provides locators dynamically based on environment or platform.
 */
export class LocatorManager {
  private platform: string;
  private locators: LocatorMap;

  constructor(platform: string = 'web') {
    this.platform = platform;
    this.locators = {};
  }

  /**
   * Add locators for a page or component
   */
  addLocators(name: string, locators: Record<string, string>) {
    this.locators[name] = locators;
  }

  /**
   * Get locator for the current platform
   */
  get(name: string): string {
    const locator = this.locators[name]?.[this.platform];
    if (!locator) throw new Error(`Locator "${name}" not found for platform "${this.platform}"`);
    return locator;
  }

  /**
   * Switch platform dynamically if needed
   */
  setPlatform(platform: string) {
    this.platform = platform;
  }
}
