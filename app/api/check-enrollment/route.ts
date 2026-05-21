import { NextResponse } from "next/server";

import { sql } from "@/lib/db";

export async function GET(
  req: Request
) {

  const { searchParams } =
    new URL(req.url);

  const courseId =
    searchParams.get("courseId");

  const clerkUserId =
    searchParams.get("clerkUserId");

  if (
    !courseId ||
    !clerkUserId
  ) {

    return NextResponse.json({
      enrolled: false,
    });

  }

  const result = await sql`
    SELECT *
    FROM enrollments
    WHERE course_id = ${courseId}
    AND clerk_user_id = ${clerkUserId}
    LIMIT 1
  `;

  return NextResponse.json({
    enrolled:
      result.length > 0,
  });
}