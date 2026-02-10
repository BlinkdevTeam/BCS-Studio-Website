// GET: Fetch booked slots for a specific date
import { NextResponse } from "next/server";
import { query } from "@/lib/postgres/db";

interface BookingSlotRow {
  slot: string;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");

  if (!date) {
    return NextResponse.json({ error: "Date is required" }, { status: 400 });
  }

  try {
    const result = await query<BookingSlotRow>(
      "SELECT TO_CHAR(booking_time, 'HH24:MI') as slot FROM appointments WHERE booking_date = $1",
      [date]
    );
    return NextResponse.json(result.rows.map((r) => r.slot));
  } catch (error) {
    console.error("Booked slots fetch error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
