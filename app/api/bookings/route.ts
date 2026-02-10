import { NextResponse } from "next/server";
import { query } from "@/lib/postgres/db";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const bookingRaw = formData.get("booking");
    const proof = formData.get("proof") as File | null;

    if (!bookingRaw || !proof) {
      return NextResponse.json(
        { error: "Missing booking data or payment proof" },
        { status: 400 }
      );
    }

    // Validate file size (5MB)
    if (proof.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File must be 5MB or smaller" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ["image/png", "image/jpeg", "application/pdf"];
    if (!allowedTypes.includes(proof.type)) {
      return NextResponse.json(
        { error: "Invalid file type" },
        { status: 400 }
      );
    }

    const booking = JSON.parse(bookingRaw.toString());

    const buffer = Buffer.from(await proof.arrayBuffer());

    const {
      customer,
      service,
      addons,
      date,
      time,
      totalPrice,
    } = booking;

    const sql = `
      INSERT INTO appointments (
        full_name,
        email,
        phone,
        description,
        booking_date,
        booking_time,
        service,
        addons,
        total_price,
        payment_proof,
        payment_proof_type
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      RETURNING id
    `;

    const values = [
      customer.name,
      customer.email,
      customer.phone,
      customer.description || null,
      date,
      time,
      service.title,
      JSON.stringify(addons ?? []),
      totalPrice,
      buffer,
      proof.type,
    ];

    const result = await query(sql, values);

    return NextResponse.json({
      message: "Booking confirmed",
      bookingId: result.rows[0].id,
    });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { error: "Failed to save booking" },
      { status: 500 }
    );
  }
}
