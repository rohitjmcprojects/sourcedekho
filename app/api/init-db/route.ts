import { sql } from "@/lib/db";

export async function GET() {
  try {
    // =========================
    // COMMUNITIES
    // =========================
    await sql`
      CREATE TABLE IF NOT EXISTS communities (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // =========================
    // COURSES
    // =========================
    await sql`
      CREATE TABLE IF NOT EXISTS courses (
        id SERIAL PRIMARY KEY,
        community_id INTEGER REFERENCES communities(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        description TEXT,
        price INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // =========================
    // ENROLLMENTS
    // =========================
    await sql`
      CREATE TABLE IF NOT EXISTS enrollments (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL,
        course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
        approved BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // =========================
    // SUBJECTS
    // =========================
    await sql`
      CREATE TABLE IF NOT EXISTS subjects (
        id SERIAL PRIMARY KEY,
        course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
        title TEXT NOT NULL
      )
    `;

    // =========================
    // LECTURES
    // =========================
    await sql`
      CREATE TABLE IF NOT EXISTS lectures (
        id SERIAL PRIMARY KEY,
        subject_id INTEGER REFERENCES subjects(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        video_url TEXT
      )
    `;

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