import { sql } from "./db";

export async function ensureDatabaseReady() {
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
      category TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      price INTEGER DEFAULT 0,
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
    CREATE TABLE IF NOT EXISTS syllabus_wise (
      id SERIAL PRIMARY KEY,
      subject_id INTEGER NOT NULL REFERENCES subjects(id),
      theme VARCHAR(255),
      topic VARCHAR(255),
      video_name VARCHAR(255),
      video_url TEXT,
      notes_name VARCHAR(255),
      notes_url TEXT,
      mcqtest_name VARCHAR(255),
      mcqtest_url TEXT,
      pyq_name VARCHAR(255),
      pyq_url TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    ALTER TABLE syllabus_wise
    ADD COLUMN IF NOT EXISTS subject_id INTEGER REFERENCES subjects(id)
  `;

  await sql`
    UPDATE syllabus_wise AS sw
    SET subject_id = (
      SELECT MIN(s.id)
      FROM subjects AS s
      INNER JOIN courses AS c ON c.id = s.course_id
      WHERE COALESCE(TO_JSONB(s) ->> 'exam_id', c.exam_id::text) = TO_JSONB(sw) ->> 'exam_id'
        AND (
          TO_JSONB(sw) ->> 'course_id' IS NULL
          OR s.course_id::text = TO_JSONB(sw) ->> 'course_id'
        )
        AND LOWER(REGEXP_REPLACE(TRIM(COALESCE(
          TO_JSONB(s) ->> 'stage',
          TO_JSONB(s) ->> 'subject_stage'
        )), '[^a-z0-9]+', '', 'g')) = LOWER(REGEXP_REPLACE(TRIM(TO_JSONB(sw) ->> 'stage'), '[^a-z0-9]+', '', 'g'))
        AND LOWER(REGEXP_REPLACE(TRIM(COALESCE(
          TO_JSONB(s) ->> 'paper',
          TO_JSONB(s) ->> 'paper_name'
        )), '[^a-z0-9]+', '', 'g')) = LOWER(REGEXP_REPLACE(TRIM(TO_JSONB(sw) ->> 'paper'), '[^a-z0-9]+', '', 'g'))
        AND LOWER(TRIM(COALESCE(
          TO_JSONB(s) ->> 'title',
          TO_JSONB(s) ->> 'subject_name',
          TO_JSONB(s) ->> 'name'
        ))) = LOWER(TRIM(TO_JSONB(sw) ->> 'subject'))
    )
    WHERE sw.subject_id IS NULL
      AND (
        SELECT COUNT(*)
        FROM subjects AS s
        INNER JOIN courses AS c ON c.id = s.course_id
        WHERE COALESCE(TO_JSONB(s) ->> 'exam_id', c.exam_id::text) = TO_JSONB(sw) ->> 'exam_id'
          AND (
            TO_JSONB(sw) ->> 'course_id' IS NULL
            OR s.course_id::text = TO_JSONB(sw) ->> 'course_id'
          )
          AND LOWER(REGEXP_REPLACE(TRIM(COALESCE(
            TO_JSONB(s) ->> 'stage',
            TO_JSONB(s) ->> 'subject_stage'
          )), '[^a-z0-9]+', '', 'g')) = LOWER(REGEXP_REPLACE(TRIM(TO_JSONB(sw) ->> 'stage'), '[^a-z0-9]+', '', 'g'))
          AND LOWER(REGEXP_REPLACE(TRIM(COALESCE(
            TO_JSONB(s) ->> 'paper',
            TO_JSONB(s) ->> 'paper_name'
          )), '[^a-z0-9]+', '', 'g')) = LOWER(REGEXP_REPLACE(TRIM(TO_JSONB(sw) ->> 'paper'), '[^a-z0-9]+', '', 'g'))
          AND LOWER(TRIM(COALESCE(
            TO_JSONB(s) ->> 'title',
            TO_JSONB(s) ->> 'subject_name',
            TO_JSONB(s) ->> 'name'
          ))) = LOWER(TRIM(TO_JSONB(sw) ->> 'subject'))
      ) = 1
  `;

  const unlinkedSyllabusRows = await sql<{ count: number }[]>`
    SELECT COUNT(*)::integer AS count
    FROM syllabus_wise
    WHERE subject_id IS NULL
  `;

  if (unlinkedSyllabusRows[0]?.count > 0) {
    throw new Error(
      `Cannot normalize syllabus_wise: ${unlinkedSyllabusRows[0].count} rows do not map uniquely to subjects.id.`
    );
  }

  await sql`
    ALTER TABLE syllabus_wise
    ALTER COLUMN subject_id SET NOT NULL
  `;

  await sql`
    ALTER TABLE syllabus_wise
    DROP CONSTRAINT IF EXISTS syllabus_wise_subject_id_fkey
  `;

  await sql`
    ALTER TABLE syllabus_wise
    ADD CONSTRAINT syllabus_wise_subject_id_fkey
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE RESTRICT
  `;

  await sql`
    ALTER TABLE syllabus_wise
      DROP COLUMN IF EXISTS exam_id,
      DROP COLUMN IF EXISTS course_id,
      DROP COLUMN IF EXISTS stage,
      DROP COLUMN IF EXISTS paper,
      DROP COLUMN IF EXISTS subject
  `;

  return true;
}
