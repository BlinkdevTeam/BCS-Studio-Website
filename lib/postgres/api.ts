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

// Similarly for booked slots & blackout dates
export async function fetchBookedSlots(date: string) {
  const res = await fetch(`/api/bookedSlots?date=${encodeURIComponent(date)}`);
  if (!res.ok) return [];
  return res.json() as Promise<string[]>;
}

export async function fetchBlackoutDates() {
  const res = await fetch("/api/blackoutDates");
  if (!res.ok) return [];
  return res.json() as Promise<string[]>;
}
