import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const clerkUserId = searchParams.get("clerkUserId");

  if (!clerkUserId) {
    return NextResponse.json({ profile: null });
  }

  const result = await sql`
    SELECT full_name, email, phone, city, address, background
    FROM profiles
    WHERE clerk_user_id = ${clerkUserId}
    LIMIT 1
  `;

  return NextResponse.json({ profile: result[0] || null });
}
