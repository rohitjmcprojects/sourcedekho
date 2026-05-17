import { sql } from "@/lib/db";

export async function GET() {
  try {
    const result = await sql`SELECT NOW()`;

    return Response.json({
      success: true,
      time: result,
    });
  } catch (error) {
    console.error(error);

    return Response.json({
      success: false,
      error,
    });
  }
}