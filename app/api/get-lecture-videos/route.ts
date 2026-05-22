import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const courseId = searchParams.get("courseId");
  const subject = searchParams.get("subject");
  const clerkUserId = searchParams.get("clerkUserId");

  if (!courseId || !subject || !clerkUserId) {
    return NextResponse.json({ lectures: [] });
  }

  const enrollment = await sql`
    SELECT 1
    FROM enrollments
    WHERE course_id = ${courseId}
      AND clerk_user_id = ${clerkUserId}
    LIMIT 1
  `;

  if (enrollment.length === 0) {
    return NextResponse.json({ lectures: [] });
  }

  const lectures = await sql`
    SELECT id, lecture_title, sub_title, duration, video_url
    FROM lectures
    WHERE course_id = ${courseId}
      AND subject_name = ${subject}
    ORDER BY id ASC
  `;

  return NextResponse.json({ lectures });
}
