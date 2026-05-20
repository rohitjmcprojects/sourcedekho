import { NextResponse } from "next/server";

import { sql } from "@/lib/db";

export async function POST(
  req: Request
) {
  try {
    const body = await req.json();

    const {
      userId,
      lectureTitle,
      subTitle,
    } = body;

    // RESET OLD
    await sql`
      UPDATE lecture_progress
      SET last_watched = false
      WHERE user_id = ${userId}
    `;

    // UPSERT CURRENT
    await sql`
      INSERT INTO lecture_progress (
        user_id,
        lecture_title,
        sub_title,
        last_watched
      )

      VALUES (
        ${userId},
        ${lectureTitle},
        ${subTitle},
        true
      )

      ON CONFLICT (
        user_id,
        sub_title
      )

      DO UPDATE SET
        last_watched = true,
        updated_at = NOW()
    `;

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}