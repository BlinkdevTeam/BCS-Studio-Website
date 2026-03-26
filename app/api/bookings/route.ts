// app/api/bookings/route.ts
"use server";

import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/postgres/db";
import { sendBookingConfirmationEmail } from "@/lib/email/sendConfirmation";
import { BookingData } from "@/types/BookingData";

// ─── GET: Fetch all bookings ─────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const sql = `
      SELECT * FROM appointments
      ORDER BY booking_date DESC, booking_time DESC
    `;
    const result = await query(sql);

    const bookings: (BookingData & {
      id: string;
      status: string;
      proof: string | null;
    })[] = result.rows.map((b) => {
      // Parse service JSON safely
      let service: BookingData["service"] = { slug: "", title: "", price: 0 };
      try {
        service = typeof b.service === "string" ? JSON.parse(b.service) : b.service;
      } catch (err) {
        console.error("Failed to parse service JSON:", b.service, err);
      }

      // Parse addons JSON safely
      let addons: BookingData["addons"] = [];
      try {
        addons = typeof b.addons === "string" ? JSON.parse(b.addons) : b.addons || [];
      } catch (err) {
        console.error("Failed to parse addons JSON:", b.addons, err);
        addons = [];
      }

      return {
        id: b.id.toString(),
        customer: {
          name: b.full_name,
          email: b.email,
          phone: b.phone,
          description: b.description || undefined,
        },
        service,
        addons,
        // ✅ Use raw date string from DB to avoid timezone shift
        date: b.booking_date,  
        time: b.booking_time,
        totalPrice: parseFloat(b.total_price),
        status: b.status,
        proof: null,
      };
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("GET bookings failed:", error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

// ─── POST: Create new booking ─────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const bookingRaw = formData.get("booking");
    const proof = formData.get("proof") as File | null;

    if (!bookingRaw || !proof) {
      return NextResponse.json(
        { error: "Missing booking data or payment proof" },
        { status: 400 },
      );
    }

    // Validate file size (5MB)
    if (proof.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File must be 5MB or smaller" },
        { status: 400 },
      );
    }

    // Validate file type
    const allowedTypes = ["image/png", "image/jpeg", "application/pdf"];
    if (!allowedTypes.includes(proof.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    // Parse booking data
    const booking: BookingData = JSON.parse(bookingRaw.toString());
    const { customer, service, addons, date, time, totalPrice } = booking;

    // Convert file to buffer
    const buffer = Buffer.from(await proof.arrayBuffer());

    // Insert booking into PostgreSQL
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
        payment_proof_type,
        status
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'Pending')
      RETURNING id
    `;
    const values = [
      customer.name,
      customer.email,
      customer.phone,
      customer.description || null,
      date,
      time,
      JSON.stringify(service),
      JSON.stringify(addons ?? []),
      totalPrice,
      buffer,
      proof.type,
    ];

    const result = await query(sql, values);
    const bookingId = result.rows[0].id;

    // Send confirmation email (non-blocking)
    try {
      await sendBookingConfirmationEmail(customer.email, customer.name, {
        serviceTitle: service.title,
        date,
        time,
        totalPrice,
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
    }

    return NextResponse.json({
      message: "Booking confirmed",
      bookingId,
    });
  } catch (error) {
    console.error("POST booking error:", error);
    return NextResponse.json(
      { error: "Failed to save booking" },
      { status: 500 },
    );
  }
}
