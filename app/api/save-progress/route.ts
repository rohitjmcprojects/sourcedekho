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
      completed,
    } = body;

    await sql`
      INSERT INTO lecture_progress (
        user_id,
        lecture_title,
        sub_title,
        completed
      )
      VALUES (
        ${userId},
        ${lectureTitle},
        ${subTitle},
        ${completed}
      )

      ON CONFLICT (
        user_id,
        sub_title
      )

      DO UPDATE SET
        completed = ${completed},
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