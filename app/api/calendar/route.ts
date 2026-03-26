"use server";

import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/postgres/db";

// Handle both fetching and adding blocks
export async function GET(req: NextRequest) {
  try {
    const blockedDatesRes = await query("SELECT * FROM blocked_dates");
    const blockedRangesRes = await query("SELECT * FROM blocked_ranges");
    const timeBlocksRes = await query("SELECT * FROM time_blocks");

    return NextResponse.json({
      blockedDates: blockedDatesRes.rows,
      blockedRanges: blockedRangesRes.rows,
      timeBlocks: timeBlocksRes.rows,
    });
  } catch (error) {
    console.error("Fetch calendar blocks failed:", error);
    return NextResponse.json({ error: "Failed to fetch calendar blocks" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, date, start_time, end_time, label } = body;

    if (!type) return NextResponse.json({ error: "Type is required" }, { status: 400 });

    if (type === "date") {
      if (!date) return NextResponse.json({ error: "Date is required" }, { status: 400 });

      await query(
        `INSERT INTO blocked_dates (date, label) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
        [date, label || "Manual Block"]
      );

      return NextResponse.json({ success: true, data: { date, label } });
    }

    if (type === "time") {
      if (!date || !start_time || !end_time)
        return NextResponse.json({ error: "Date, start_time, end_time required" }, { status: 400 });

      await query(
        `INSERT INTO time_blocks (date, start_time, end_time, label) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING`,
        [date, start_time, end_time, label || null]
      );

      return NextResponse.json({ success: true, data: { date, start_time, end_time, label } });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error) {
    console.error("Block date failed:", error);
    return NextResponse.json({ error: "Failed to block date" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, date, id } = body;

    if (!type) return NextResponse.json({ error: "Type is required" }, { status: 400 });

    if (type === "date") {
      if (!date) return NextResponse.json({ error: "Date is required" }, { status: 400 });

      await query(`DELETE FROM blocked_dates WHERE date = $1`, [date]);

      return NextResponse.json({ success: true });
    }

    if (type === "time") {
      if (!id) return NextResponse.json({ error: "ID is required for time block" }, { status: 400 });

      await query(`DELETE FROM time_blocks WHERE id = $1`, [id]);

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error) {
    console.error("Remove block failed:", error);
    return NextResponse.json({ error: "Failed to remove block" }, { status: 500 });
  }
}