import type { BookingData } from "./types";

export async function createBooking(data: BookingData): Promise<{
  message?: string;
  error?: string;
}> {
  const res = await fetch("/api/createBooking", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
}
