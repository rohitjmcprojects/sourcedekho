import { NextResponse } from "next/server";

import { sql } from "@/lib/db";

export async function GET(
  req: Request
) {
  const { searchParams } =
    new URL(req.url);

  const userId =
    searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(null);
  }

  const result = await sql`
    SELECT sub_title
    FROM lecture_progress
    WHERE user_id = ${userId}
    AND last_watched = true
    LIMIT 1
  `;

  return NextResponse.json(
    result[0] || null
  );
}