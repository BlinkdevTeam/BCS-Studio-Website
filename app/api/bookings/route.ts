// POST: Save a new booking
import { NextResponse } from "next/server";
import { query } from "@/lib/postgres/db";

interface BookingBody {
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
  date: string;
  time: string;
  totalPrice: number;
}

interface InsertResultRow {
  id: number;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as BookingBody;

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

    const sql = `
      INSERT INTO appointments (
        full_name,
        email,
        phone,
        description,
        service,
        addons,
        booking_date,
        booking_time,
        total_price
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING id
    `;

    const values = [
      customer.name,
      customer.email,
      customer.phone,
      customer.description ?? null,
      JSON.stringify(service),
      JSON.stringify(addons ?? []),
      date,
      time,
      totalPrice,
    ];

    const result = await query<InsertResultRow>(sql, values);

    return NextResponse.json({
      message: "Booking confirmed!",
      bookingId: result.rows[0].id,
    });
  } catch (error: unknown) {
    console.error("Booking POST error:", error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
