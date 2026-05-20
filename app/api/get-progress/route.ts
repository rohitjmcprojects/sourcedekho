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
    return NextResponse.json({
      completedVideos: [],
    });
  }

  const progress = await sql`
    SELECT sub_title
    FROM lecture_progress
    WHERE user_id = ${userId}
    AND completed = true
  `;

  return NextResponse.json({
    completedVideos: progress.map(
      (p: any) => p.sub_title
    ),
  });
}