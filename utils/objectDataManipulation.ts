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

/**
 * Returns typed keys of an object
 */
export function getObjectKeys<T extends Record<string, any>>(
  obj: T
): (keyof T & string)[] {
  return Object.keys(obj) as (keyof T & string)[];
}

export function getJsonKeys<T extends Record<string, unknown>>(
  obj: T
): (keyof T & string)[] {
  return Object.keys(obj) as (keyof T & string)[];
}
