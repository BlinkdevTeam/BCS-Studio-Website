import { NextResponse } from 'next/server';
import { query } from '@/lib/postgres/db';

interface BlackoutRow {
  blackout_date: string;
}

export async function GET() {
  try {
    // This assumes you created a table for blackout dates
    const result = await query<BlackoutRow>("SELECT TO_CHAR(blackout_date, 'YYYY-MM-DD') as blackout_date FROM blackout_dates");
    return NextResponse.json(result.rows.map(row => row.blackout_date));
  } catch (error) {
    // If the table doesn't exist yet, return empty array so the app doesn't crash
    console.error("Blackout fetch error:", error);
    return NextResponse.json([]);
  }
}