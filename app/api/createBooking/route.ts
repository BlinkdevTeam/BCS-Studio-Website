import { NextResponse } from "next/server";
import { createBooking, BookingData } from "@/lib/postgres/api"; // ✅ import type from API

export async function POST(req: Request) {
  try {
    const body: BookingData = await req.json();

    // Basic validation
    if (!body.name || !body.email || !body.phone || !body.date || !body.time) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Save to database
    const result = await createBooking(body);

    return NextResponse.json({ message: "Booking confirmed!", result });
  } catch (err) {
    console.error("Error creating booking:", err);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
