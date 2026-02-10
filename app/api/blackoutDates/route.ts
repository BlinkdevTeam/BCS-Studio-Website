// GET: Fetch all blackout dates
import { NextResponse } from "next/server";
import { query } from "@/lib/postgres/db";

interface BlackoutRow {
  blackout_date: string;
}

export async function GET() {
  try {
    const result = await query<BlackoutRow>(
      "SELECT TO_CHAR(blackout_date, 'YYYY-MM-DD') as blackout_date FROM blackout_dates"
    );
    return NextResponse.json(result.rows.map((r) => r.blackout_date));
  } catch (error) {
    console.error("Blackout fetch error:", error);
    return NextResponse.json([]);
  }
}
