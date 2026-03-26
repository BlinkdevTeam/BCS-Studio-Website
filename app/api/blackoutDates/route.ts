// GET: Fetch all blackout dates
import { NextResponse } from "next/server";
import { query } from "@/lib/postgres/db";

interface BlackoutRow {
  date: string;
}

export async function GET() {
  try {
    const result = await query<BlackoutRow>(
      "SELECT TO_CHAR(date, 'YYYY-MM-DD') as date FROM blocked_dates"
    );
    return NextResponse.json(result.rows.map((r) => r.date));
  } catch (error) {
    console.error("Blackout fetch error:", error);
    return NextResponse.json([]);
  }
}
