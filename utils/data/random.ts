// test-helpers/data/random.ts
import { faker } from "@faker-js/faker";

// Run the test again with seed 42 — you get the exact same values every time
export function seedRandom(seed: number) {
  faker.seed(seed);
}

/**
 * Random alphabetic text
 */
export function randomText(
  options?: {
    prefix?: string;
    length?: number;
  }
): string {
  const {
    prefix = "",
    length = 8,
  } = options ?? {};

  return `${prefix}${faker.string.alpha({ length })}`;
}

/**
 * Random numeric string (safe for inputs)
 */
export function randomNumericText(
  options?: {
    prefix?: string;
    digits?: number;
  }
): string {
  const {
    prefix = "",
    digits = 4,
  } = options ?? {};

  const value = faker.number.int({
    min: 10 ** (digits - 1),
    max: 10 ** digits - 1,
  });

  return `${prefix}${value}`;
}
