// app/api/createBooking/route.ts

import { NextResponse } from "next/server";
import { createBooking, BookingData } from "@/lib/postgres/api";

export async function POST(req: Request) {
  try {
    const body: BookingData = await req.json();

    // Basic validation
    if (
      !body.customer?.name ||
      !body.customer?.email ||
      !body.customer?.phone ||
      !body.service?.slug ||
      !body.date ||
      !body.time ||
      !body.totalPrice
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Optional: validate service price
    if (typeof body.service.price !== "number") {
      return NextResponse.json(
        { error: "Invalid service price" },
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
