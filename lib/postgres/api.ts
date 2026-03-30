// lib/postgres/api.ts
import type { BookingData } from "./types";

export async function createBooking(data: BookingData) {
  const res = await fetch("/api/createBooking", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error((await res.json()).error || "Failed to create booking");
  }

  return res.json();
}

// Fetch booked slots for a specific date
export async function fetchBookedSlots(date: string) {
  const res = await fetch(`/api/bookedSlots?date=${encodeURIComponent(date)}`);
  if (!res.ok) return [];
  return res.json() as Promise<string[]>;
}

// Fetch manually blocked blackout dates
export async function fetchBlackoutDates() {
  const res = await fetch("/api/blackoutDates");
  if (!res.ok) return [];
  return res.json() as Promise<string[]>;
}

// -------------------- NEW --------------------
// Fetch calendar data including blackout dates, blocked ranges, and time blocks
export async function fetchCalendarData() {
  const res = await fetch("/api/calendar");
  if (!res.ok) return { blockedDates: [], blockedRanges: [], timeBlocks: [] };

  return res.json() as Promise<{
    blockedDates: string[]; // e.g. ["2026-03-28", "2026-03-30"]
    blockedRanges: { start: string; end: string }[]; // e.g. [{ start: "2026-04-01", end: "2026-04-03" }]
    timeBlocks: { date: string; start_time: string; end_time: string }[]; // e.g. [{ date: "2026-03-29", start_time: "09:00", end_time: "11:00" }]
  }>;
}

export async function fetchPackages() {
  const res = await fetch("/api/packages");
  if (!res.ok) return [];
  return res.json();
}