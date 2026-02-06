/**
 * Define an interface for the booking data to avoid using 'any'.
 * This makes the code self-documenting and ESLint friendly.
 */
export interface BookingData {
  name: string;
  email: string;
  phone: string;
  description: string;
  date: string; // "yyyy-MM-dd"
  time: string; // "HH:mm"
}

export async function fetchBookedSlots(date: string): Promise<string[]> {
  const res = await fetch(`/api/bookings?date=${encodeURIComponent(date)}`);
  
  if (!res.ok) {
    return [];
  }
  
  // Explicitly casting the JSON response ensures type safety
  const data = (await res.json()) as string[];
  return data;
}

export async function createBooking(data: BookingData): Promise<{ message?: string; error?: string }> {
  const res = await fetch('/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  const result = (await res.json()) as { message?: string; error?: string };
  return result;
}

// Replacement for your old PHP blackout script
export async function fetchBlackoutDates(): Promise<string[]> {
  const res = await fetch('/api/blackout');
  
  if (!res.ok) {
    return [];
  }
  
  const data = (await res.json()) as string[];
  return data;
}