/**
 * Formats score or points to prevent long decimal numbers from breaking the UI layout.
 * If the value is an integer, it returns it as is.
 * Otherwise, it rounds to 1 decimal place (e.g. 96.66666666666666 -> "96.7").
 */
export function formatScoreOrPoints(value: number | string | null | undefined): string {
  if (value === null || value === undefined) return "0";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "0";
  if (Number.isInteger(num)) {
    return num.toString();
  }
  const formatted = num.toFixed(1);
  return formatted.endsWith(".0") ? formatted.slice(0, -2) : formatted;
}
