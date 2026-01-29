// test-helpers/data/boundaries.ts

export function minLengthText(min: number): string {
  return "a".repeat(min);
}

export function maxLengthText(max: number): string {
  return "a".repeat(max);
}

export function overMaxLengthText(max: number): string {
  return "a".repeat(max + 1);
}

export function emptyText(): string {
  return "";
}

export function whitespaceText(): string {
  return "   ";
}

