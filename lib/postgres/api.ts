// lib/postgres/api.ts
export interface BookingData {
  customer: {
    name: string;
    email: string;
    phone: string;
    description?: string;
  };
  service: {
    slug: string;
    title: string;
    price: number;
  };
  addons?: { id: string; label: string; price: number }[];
  totalPrice: number;
  date: string; // "yyyy-MM-dd"
  time: string; // "HH:mm"
}

// Example: fetch booked slots for a given date
export async function fetchBookedSlots(date: string): Promise<string[]> {
  const res = await fetch(`/api/bookedSlots?date=${encodeURIComponent(date)}`);
  if (!res.ok) return [];
  const data = (await res.json()) as string[];
  return data;
}

// Example: fetch blackout dates
export async function fetchBlackoutDates(): Promise<string[]> {
  const res = await fetch("/api/blackoutDates");
  if (!res.ok) return [];
  const data = (await res.json()) as string[];
  return data;
}

// Save booking to database
export async function createBooking(
  data: BookingData
): Promise<{ message?: string; error?: string }> {
  const res = await fetch("/api/createBooking", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return (await res.json()) as { message?: string; error?: string };
}
