const BASE_URL = "http://localhost/api";

export async function fetchBookedSlots(date: string): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/get_booked_slots.php?date=${date}`);
  if (!res.ok) return [];
  return res.json();
}

export async function createBooking(data: { name: string; email: string; phone?: string;description?: string; date: string; time: string }) {
  const res = await fetch(`${BASE_URL}/create_booking.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}