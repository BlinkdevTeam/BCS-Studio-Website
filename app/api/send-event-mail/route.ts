import { NextRequest, NextResponse } from "next/server";
import { sendTalkToOurTeamEmail } from "@/lib/email/TalkToOurTeam";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, email, phone, message } = data;

    if (!name || !email || !phone || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    await sendTalkToOurTeamEmail({ name, email, phone, message });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Failed to send email:", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}