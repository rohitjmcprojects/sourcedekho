import { sql } from "./db";

export async function ensureDatabaseReady() {
  await sql`
    CREATE TABLE IF NOT EXISTS communities (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS exams (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  const examSeeds = [
    {
      name: "HCS 2026",
      description: "Complete preparation community for Haryana Civil Services 2026.",
    },
    {
      name: "UPPCS 2026",
      description: "Daily classes, notes, MCQs, and PYQs for UPPCS aspirants.",
    },
    {
      name: "RAS 2026",
      description: "Focused Rajasthan Administrative Services preparation.",
    },
    {
      name: "UPSC 2027",
      description: "Premium UPSC preparation ecosystem for 2027 aspirants.",
    },
  ];

  for (const exam of examSeeds) {
    await sql`
      INSERT INTO exams (name, description)
      SELECT ${exam.name}, ${exam.description}
      WHERE NOT EXISTS (
        SELECT 1 FROM exams WHERE LOWER(name) = LOWER(${exam.name})
      )
    `;
  }

  await sql`
    CREATE TABLE IF NOT EXISTS courses (
      id SERIAL PRIMARY KEY,
      exam_id INTEGER REFERENCES exams(id) ON DELETE CASCADE,
      community_id INTEGER REFERENCES communities(id) ON DELETE CASCADE,
      category TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      price INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS enrollments (
      id SERIAL PRIMARY KEY,
      user_id TEXT NOT NULL,
      course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
      approved BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS subjects (
      id SERIAL PRIMARY KEY,
      course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
      title TEXT NOT NULL
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS lectures (
      id SERIAL PRIMARY KEY,
      subject_id INTEGER REFERENCES subjects(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      video_url TEXT
    )
  `;

  return true;
}
