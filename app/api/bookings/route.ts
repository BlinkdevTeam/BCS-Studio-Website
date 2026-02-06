import { NextResponse } from 'next/server';
import { query } from '@/lib/postgres/db';

/**
 * Define interfaces for our database rows to avoid 'any'.
 * This satisfies the @typescript-eslint/no-explicit-any rule.
 */
interface BookingSlotRow {
  slot: string;
}

interface InsertResultRow {
  id: number;
}

// GET: Check which slots are already taken for a specific date
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');

  if (!date) {
    return NextResponse.json({ error: 'Date is required' }, { status: 400 });
  }

  try {
    // Using the generic <BookingSlotRow> we defined above
    const result = await query<BookingSlotRow>(
      "SELECT TO_CHAR(booking_time, 'HH24:MI') as slot FROM appointments WHERE booking_date = $1",
      [date]
    );
    
    return NextResponse.json(result.rows.map((row) => row.slot));
  } catch (error) {
    console.error("DB Error:", error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

// POST: Save a new booking to the database
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, description, date, time } = body;

    const sql = `
      INSERT INTO appointments (full_name, email, phone, description, booking_date, booking_time)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `;
    const values = [name, email, phone, description, date, time];

    const result = await query<InsertResultRow>(sql, values);

    return NextResponse.json({ 
      message: 'Booking confirmed!', 
      bookingId: result.rows[0].id 
    });
  } catch (error: unknown) {
    /**
     * ESLint fix: Use 'unknown' instead of 'any' for errors.
     * We then check if the error is an object with a 'code' property.
     */
    if (
      error !== null &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === '23505'
    ) {
      return NextResponse.json(
        { error: 'This slot has just been taken.' }, 
        { status: 409 }
      );
    }
    
    console.error("Postgres Error:", error);
    return NextResponse.json({ error: 'Failed to save booking' }, { status: 500 });
  }
}