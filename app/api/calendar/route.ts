"use server";

import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/postgres/db";

// ─────────────────────────────────────────────
// GET: Fetch all calendar data
// ─────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const blockedDatesRes = await query("SELECT * FROM blocked_dates");
    const blockedRangesRes = await query("SELECT * FROM blocked_ranges");
    const timeBlocksRes = await query("SELECT * FROM time_blocks");
    const openDatesRes = await query("SELECT * FROM open_dates"); // ✅ NEW

    return NextResponse.json({
      blockedDates: blockedDatesRes.rows,
      blockedRanges: blockedRangesRes.rows,
      timeBlocks: timeBlocksRes.rows,
      openDates: openDatesRes.rows, // ✅ NEW
    });
  } catch (error) {
    console.error("Fetch calendar blocks failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch calendar blocks" },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────
// POST: Add blocks
// ─────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type } = body;

    if (!type) {
      return NextResponse.json(
        { error: "Type is required" },
        { status: 400 }
      );
    }

    // ─── DATE BLOCK ───────────────────────────
    if (type === "date") {
      const { date, label } = body;

      if (!date) {
        return NextResponse.json(
          { error: "Date is required" },
          { status: 400 }
        );
      }

      await query(
        `INSERT INTO blocked_dates (date, label)
         VALUES ($1, $2)
         ON CONFLICT (date) DO NOTHING`,
        [date, label || "Manual Block"]
      );

      return NextResponse.json({
        success: true,
        data: { date, label },
      });
    }

    // ─── RANGE BLOCK ──────────────────────────
    if (type === "range") {
      const { start, end, label } = body;

      if (!start || !end) {
        return NextResponse.json(
          { error: "Start and end dates are required" },
          { status: 400 }
        );
      }

      const result = await query(
        `INSERT INTO blocked_ranges (start_date, end_date, label)
         VALUES ($1, $2, $3)
         RETURNING id`,
        [start, end, label || "Blocked Range"]
      );

      return NextResponse.json({
        success: true,
        data: {
          id: result.rows[0].id,
          start,
          end,
          label,
        },
      });
    }

    // ─── TIME BLOCK ──────────────────────────
    if (type === "time") {
      const { date, start_time, end_time, label } = body;

      if (!date || !start_time || !end_time) {
        return NextResponse.json(
          { error: "Date, start_time, end_time required" },
          { status: 400 }
        );
      }

      const result = await query(
        `INSERT INTO time_blocks (date, start_time, end_time, label)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        [date, start_time, end_time, label || null]
      );

      return NextResponse.json({
        success: true,
        data: {
          id: result.rows[0].id,
          date,
          start_time,
          end_time,
          label,
        },
      });
    }

    // ─── OPEN DATE (EXCEPTION) ✅ NEW ─────────
    if (type === "open") {
      const { date } = body;

      if (!date) {
        return NextResponse.json(
          { error: "Date is required" },
          { status: 400 }
        );
      }

      await query(
        `INSERT INTO open_dates (date)
         VALUES ($1)
         ON CONFLICT (date) DO NOTHING`,
        [date]
      );

      return NextResponse.json({
        success: true,
        data: { date },
      });
    }

    // ─── INVALID TYPE ────────────────────────
    return NextResponse.json(
      { error: "Invalid type" },
      { status: 400 }
    );

  } catch (error) {
    console.error("Block creation failed:", error);
    return NextResponse.json(
      { error: "Failed to create block" },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────
// DELETE: Remove blocks
// ─────────────────────────────────────────────
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, date, id } = body;

    if (!type) {
      return NextResponse.json(
        { error: "Type is required" },
        { status: 400 }
      );
    }

    // ─── DELETE DATE ─────────────────────────
    if (type === "date") {
      if (!date) {
        return NextResponse.json(
          { error: "Date is required" },
          { status: 400 }
        );
      }

      await query(`DELETE FROM blocked_dates WHERE date = $1`, [date]);

      return NextResponse.json({ success: true });
    }

    // ─── DELETE RANGE ────────────────────────
    if (type === "range") {
      if (!id) {
        return NextResponse.json(
          { error: "ID is required for range block" },
          { status: 400 }
        );
      }

      await query(`DELETE FROM blocked_ranges WHERE id = $1`, [id]);

      return NextResponse.json({ success: true });
    }

    // ─── DELETE TIME ─────────────────────────
    if (type === "time") {
      if (!id) {
        return NextResponse.json(
          { error: "ID is required for time block" },
          { status: 400 }
        );
      }

      await query(`DELETE FROM time_blocks WHERE id = $1`, [id]);

      return NextResponse.json({ success: true });
    }

    // ─── DELETE OPEN DATE ✅ NEW ─────────────
    if (type === "open") {
      if (!date) {
        return NextResponse.json(
          { error: "Date is required" },
          { status: 400 }
        );
      }

      await query(`DELETE FROM open_dates WHERE date = $1`, [date]);

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: "Invalid type" },
      { status: 400 }
    );

  } catch (error) {
    console.error("Remove block failed:", error);
    return NextResponse.json(
      { error: "Failed to remove block" },
      { status: 500 }
    );
  }
}