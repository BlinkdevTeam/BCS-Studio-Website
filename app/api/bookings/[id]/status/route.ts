import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/postgres/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // <- notice Promise
) {
  try {
    // Unwrap the promise
    const { id } = await params;

    // Parse the body safely
    let status: string;
    try {
      const body = await req.json();
      status = body.status;
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    // Validate status
    const allowed = ["Pending", "Confirmed", "Cancelled"];
    if (!allowed.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Convert ID to number
    const bookingId = Number(id);
    if (isNaN(bookingId)) {
      return NextResponse.json({ error: "Invalid booking ID" }, { status: 400 });
    }

    // Update in DB
    const sql = `
      UPDATE appointments
      SET status = $1
      WHERE id = $2
      RETURNING id, status
    `;
    const result = await query(sql, [status, bookingId]);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Status updated",
      booking: result.rows[0],
    });
  } catch (error) {
    console.error("PATCH booking status error:", error);
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
  }
}