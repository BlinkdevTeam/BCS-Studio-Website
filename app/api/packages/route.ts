import { NextResponse } from "next/server";
import { query } from "@/lib/postgres/db";
import { v4 as uuidv4 } from "uuid";

// ── DB row types ──
interface PackageRow {
  id: string;
  title: string;
  description: string | null;
  duration: number;
  price: number;
  is_active: boolean;
  color: string | null;
  created_at: string;
}

interface InclusionRow {
  id: string;
  package_id: string;
  text: string;
}

interface AddonRow {
  id: string;
  package_id: string;
  label: string;
  price: number;
}

// ── Request body type ──
interface PackagePayload {
  id?: string;
  title: string;
  description?: string;
  duration: number;
  price: number;
  isActive: boolean;
  color?: string;
  inclusions: { id: string; text: string }[];
  addons: { id: string; label: string; price: number }[];
}

// ── Helper: upsert inclusions & add-ons ──
async function upsertDetails(
  packageId: string,
  inclusions: { id: string; text: string }[],
  addons: { id: string; label: string; price: number }[]
): Promise<void> {
  // Clear old records
  await query(`DELETE FROM package_inclusions WHERE package_id = $1`, [packageId]);
  await query(`DELETE FROM package_addons WHERE package_id = $1`, [packageId]);

  // Insert new inclusions
  for (const inc of inclusions) {
    await query(
      `INSERT INTO package_inclusions (id, package_id, text) VALUES ($1, $2, $3)`,
      [inc.id, packageId, inc.text]
    );
  }

  // Insert new add-ons
  for (const a of addons) {
    await query(
      `INSERT INTO package_addons (id, package_id, label, price) VALUES ($1, $2, $3, $4)`,
      [a.id, packageId, a.label, a.price]
    );
  }
}

// ── GET packages ──
export async function GET() {
  try {
    const packagesRes = await query<PackageRow>(`SELECT * FROM packages ORDER BY created_at DESC`);
    const inclusionsRes = await query<InclusionRow>(`SELECT * FROM package_inclusions`);
    const addonsRes = await query<AddonRow>(`SELECT * FROM package_addons`);

    const packages = packagesRes.rows.map((pkg) => ({
      ...pkg,
      isActive: pkg.is_active,
      inclusions: inclusionsRes.rows
        .filter((i) => i.package_id === pkg.id)
        .map((i) => ({ id: i.id, text: i.text })),
      addons: addonsRes.rows
        .filter((a) => a.package_id === pkg.id)
        .map((a) => ({ id: a.id, label: a.label, price: a.price })),
    }));

    return NextResponse.json(packages);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch packages" }, { status: 500 });
  }
}

// ── POST save package ──
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      id,
      title,
      description = "",
      duration,
      price,
      isActive,
      color = "",
      type = "portrait",           // <-- make sure we get this from frontend
      inclusions = [],
      addons = [],
    } = body;

    // Ensure packageId
    const packageId = id || uuidv4();

    if (id) {
      // Update existing package
      await query(
        `UPDATE packages
         SET title=$1, description=$2, duration=$3, price=$4, is_active=$5, color=$6, type=$7
         WHERE id=$8`,
        [title, description, duration, price, isActive, color, type, id]
      );
    } else {
      // Insert new package
      await query(
        `INSERT INTO packages (id, title, description, duration, price, is_active, color, type, created_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW())`,
        [packageId, title, description, duration, price, isActive, color, type]
      );
    }

    // ── Upsert inclusions ──
    await query(`DELETE FROM package_inclusions WHERE package_id = $1`, [packageId]);
    for (const inc of inclusions) {
      await query(
        `INSERT INTO package_inclusions (id, package_id, text) VALUES ($1, $2, $3)`,
        [inc.id || uuidv4(), packageId, inc.text]
      );
    }

    // ── Upsert add-ons ──
    await query(`DELETE FROM package_addons WHERE package_id = $1`, [packageId]);
    for (const a of addons) {
      await query(
        `INSERT INTO package_addons (id, package_id, label, price) VALUES ($1, $2, $3, $4)`,
        [a.id || uuidv4(), packageId, a.label, a.price]
      );
    }

    return NextResponse.json({ success: true, id: packageId });
  } catch (err) {
    console.error("Failed to save package:", err);
    return NextResponse.json({ error: "Failed to save package" }, { status: 500 });
  }
}