import { NextResponse } from "next/server";
import { query } from "@/lib/postgres/db";
import type { BookingData } from "@/lib/postgres/types";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as BookingData;
    const { customer, service, addons, date, time, totalPrice } = body;

    if (
      !customer?.name ||
      !customer?.email ||
      !customer?.phone ||
      !service?.slug ||
      !date ||
      !time ||
      typeof totalPrice !== "number"
    ) {
      return NextResponse.json({ error: "Invalid booking data" }, { status: 400 });
    }

    const result = await query<{ id: string }>(
      `
      INSERT INTO bookings (
        full_name,
        email,
        phone,
        description,
        booking_date,
        booking_time,
        service,
        addons,
        total_price
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING id
      `,
      [
        customer.name,
        customer.email,
        customer.phone,
        customer.description ?? null,
        date,
        time,
        JSON.stringify(service),
        JSON.stringify(addons ?? []),
        totalPrice,
      ]
    );

    return NextResponse.json({
      message: "Booking created successfully",
      bookingId: result.rows[0].id,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
