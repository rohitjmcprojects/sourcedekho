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
    SELECT payment_status
    FROM enrollments
    WHERE course_id = ${courseId}
    AND clerk_user_id = ${clerkUserId}
    LIMIT 1
  `;

  if (result.length === 0) {
    return NextResponse.json({
      enrolled: false,
      status: null,
    });
  }

  const status = result[0].payment_status;

  return NextResponse.json({
    enrolled: status === "approved",
    status,
  });
}