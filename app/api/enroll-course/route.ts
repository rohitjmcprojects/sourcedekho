import { NextResponse } from "next/server";

import { sql } from "@/lib/db";

export async function POST(
  req: Request
) {

  try {

    const body =
      await req.json();

    console.log(
      "BODY:",
      body
    );

    const {
      clerkUserId,
      courseId,
      fullName,
      email,
      phone,
      city,
      address,
      background,
      transactionNo,
    } = body;

    // VALIDATION
    if (
      !clerkUserId ||
      !courseId ||
      !fullName
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields",
        },
        {
          status: 400,
        }
      );
    }

    // CHECK EXISTING
    const existing =
      await sql`
        SELECT *
        FROM enrollments
        WHERE
          clerk_user_id =
            ${clerkUserId}
          AND
          course_id =
            ${Number(courseId)}
      `;

    if (
      existing.length > 0
    ) {

      return NextResponse.json(
        {
          error:
            "Already enrolled",
        },
        {
          status: 400,
        }
      );

    }

    // PROFILE UPSERT
    await sql`
      INSERT INTO profiles (

        clerk_user_id,
        full_name,
        email,
        phone,
        city,
        address,
        background

      )

      VALUES (

        ${clerkUserId},
        ${fullName},
        ${email},
        ${phone},
        ${city},
        ${address},
        ${background}

      )

      ON CONFLICT (
        clerk_user_id
      )

      DO UPDATE SET

        full_name =
          EXCLUDED.full_name,

        email =
          EXCLUDED.email,

        phone =
          EXCLUDED.phone,

        city =
          EXCLUDED.city,

        address =
          EXCLUDED.address,

        background =
          EXCLUDED.background,

        updated_at = NOW()
    `;

    // ENROLLMENT
    await sql`
      INSERT INTO enrollments (

        clerk_user_id,
        course_id,
        full_name,
        email,
        phone,
        city,
        address,
        background,
        transaction_no,
        payment_status

      )

      VALUES (

        ${clerkUserId},
        ${Number(courseId)},
        ${fullName},
        ${email},
        ${phone},
        ${city},
        ${address},
        ${background},
        ${transactionNo},
        'pending'

      )
    `;

    return NextResponse.json({
      success: true,
    });

  } catch (err: any) {

    console.log(err);

    return NextResponse.json(
      {
        error:
          err?.message ||
          "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}