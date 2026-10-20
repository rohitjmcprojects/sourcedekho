import { ensureDatabaseReady } from "@/lib/db-init";

export async function GET() {
  try {
    await ensureDatabaseReady();

    return Response.json({
      success: true,
      message: "Database initialized successfully",
    });
  } catch (error) {
    console.error(error);

    return Response.json({
      success: false,
      error,
    });
  }
}