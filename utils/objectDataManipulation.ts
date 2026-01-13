/**
 * Returns the keys of an object whose values satisfy a predicate function
 */
export function getObjectKeysByValue<T extends Record<string, any>>(
  obj: T,
  predicate: (value: T[keyof T]) => boolean
): (keyof T & string)[] {
  return Object.entries(obj)
    .filter(([_, value]) => predicate(value))
    .map(([key]) => key as keyof T & string)
}
