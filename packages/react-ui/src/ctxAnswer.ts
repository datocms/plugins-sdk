const warned = new Set<string>();

/** Writes the warning once for each `key`, only in development */
export function warnOnceInDev(key: string, message: string) {
  if (!import.meta.env.DEV || warned.has(key)) {
    return;
  }

  warned.add(key);
  console.warn(message);
}

/**
 * The answer of a `load…` method of `ctx`, with one entry for each input. An
 * answer that is not an array with one entry for each input comes from a
 * wrong or older host: each entry is then null, as a record or an asset that
 * does not exist, and a row does not crash.
 */
export function entriesOfAnswer<T>(
  answer: unknown,
  count: number,
  method: string,
): Array<T | null> {
  if (Array.isArray(answer) && answer.length === count) {
    return answer as Array<T | null>;
  }

  warnOnceInDev(
    `${method}:shape`,
    `ctx.${method} of the DatoCMS host did not give an array with one entry for each input. The entries show as not found.`,
  );

  return Array.from({ length: count }, () => null);
}
