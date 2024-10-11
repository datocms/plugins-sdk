export function isNullish(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isArray<T>(
  value: unknown,
  checkItem: (item: unknown) => item is T,
): value is T[] {
  return Array.isArray(value) && value.every(checkItem);
}

export function isPlacement(value: unknown) {
  return (
    isArray(value, isString) &&
    value.length === 2 &&
    ['before', 'after'].includes(value[0])
  );
}
