const sizeUnits = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];

// The number with at most `precision` decimals, without the zeros at the
// end: 3.60 → "3.6", 50.00 → "50"
function toFixedTrimmed(value: number, precision: number) {
  return String(Number(value.toFixed(precision)));
}

export function formatBytes(bytes: number | null, decimalPrecision = 1) {
  if (!bytes || Number.isNaN(bytes) || !Number.isFinite(bytes)) {
    return '-';
  }

  if (bytes === 0) {
    return '0 bytes';
  }

  const unitIndex = Math.floor(Math.log(bytes) / Math.log(1024));
  const convertedSize = toFixedTrimmed(
    bytes / 1024 ** unitIndex,
    decimalPrecision,
  );

  return `${convertedSize}${sizeUnits[unitIndex]}`;
}

const callUnits = ['calls', 'k', 'M'];

export function formatCalls(
  callCount: number | null,
  precision = 1,
  showCalls = true,
): string {
  if (
    callCount === null ||
    Number.isNaN(parseFloat(callCount as any)) ||
    !Number.isFinite(callCount)
  ) {
    return '-';
  }

  if (callCount < 1) {
    return showCalls ? 'No calls' : '0';
  }

  if (callCount < 2) {
    return showCalls ? '1 call' : '1';
  }

  // Calculate which unit to use: 0 = calls, 1 = k (thousands), 2 = M (millions)
  const unitIndex = Math.floor(Math.log(callCount) / Math.log(1000));
  const unit = unitIndex === 0 && !showCalls ? '' : callUnits[unitIndex];

  const formattedNumber = toFixedTrimmed(
    callCount / 1000 ** unitIndex,
    unitIndex === 0 ? 0 : precision,
  );

  // A word takes a space, a symbol does not: "12 calls", "9.9M"
  return unitIndex === 0
    ? `${formattedNumber} ${unit}`.trim()
    : `${formattedNumber}${unit}`;
}

/**
 * Formats seconds into a human-readable time string with optional precision.
 *
 * @param num - The number of seconds to format
 * @param precision - Decimal places for values >= 60k seconds (default: 1).
 *   The zeros at the end of the decimals do not show.
 *
 * Examples:
 *   formatSeconds(1) → "1 sec"
 *   formatSeconds(45) → "45 secs"
 *   formatSeconds(60) → "1 min"
 *   formatSeconds(90) → "2 mins"
 *   formatSeconds(3661) → "61 mins"
 *   formatSeconds(65000) → "1.1k mins"
 *   formatSeconds(65000, 0) → "1k mins"
 *   formatSeconds(65000, 2) → "1.08k mins"
 *   formatSeconds(216000) → "3.6k mins"
 */
export function formatSeconds(num: number | null, precision = 1) {
  if (!num) {
    return '-';
  }

  if (num >= 60 * 1000) {
    return `${toFixedTrimmed(num / (60 * 1000), precision)}k mins`;
  }

  if (num >= 60) {
    const formattedNumber = (num / 60).toFixed(0);
    return formattedNumber === '1'
      ? `${formattedNumber} min`
      : `${formattedNumber} mins`;
  }

  const rounded = num.toFixed(0);
  return rounded === '1' ? `${rounded} sec` : `${rounded} secs`;
}
