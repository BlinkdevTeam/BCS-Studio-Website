/**
 * Parses a date and optional time into a local Date object.
 * Handles:
 *   - ISO date strings (with Z) correctly
 *   - Separate date + time strings without converting to UTC
 */
// utils/dateUtils.ts
export function parseLocalDateTime(dateStr: string, timeStr?: string): Date {
  if (!dateStr) return new Date();

  try {
    // Extract date part only, ignore Z and hours in ISO
    const datePart = dateStr.split("T")[0]; // "2026-04-14"

    const [year, month, day] = datePart.split("-").map(Number);
    const [hour = 0, minute = 0, second = 0] = (timeStr || "00:00:00")
      .split(":")
      .map(Number);

    // Construct as local time
    const dt = new Date(year, month - 1, day + 1, hour, minute, second);

    if (isNaN(dt.getTime())) {
      console.warn("Invalid date/time:", dateStr, timeStr);
      return new Date();
    }

    return dt;
  } catch (err) {
    console.warn("Error parsing date/time:", dateStr, timeStr, err);
    return new Date();
  }
}

export function formatDateTime(dt: Date): string {
  return dt.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}