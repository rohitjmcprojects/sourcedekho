-- Run after the `exams` table already exists.
-- One question table supports both MCQs and PYQs through `question_type`.

CREATE TABLE IF NOT EXISTS test_questions (
  id BIGSERIAL PRIMARY KEY,
  exam_id INTEGER NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  subject_name TEXT NOT NULL,
  lecture_title TEXT NOT NULL,
  sub_title TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('mcqs', 'pyqs')),
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_option CHAR(1) NOT NULL CHECK (correct_option IN ('A', 'B', 'C', 'D')),
  explanation TEXT,
  marks NUMERIC(6, 2) NOT NULL DEFAULT 1 CHECK (marks > 0),
  difficulty TEXT NOT NULL DEFAULT 'mixed' CHECK (difficulty IN ('easy', 'mixed', 'exam')),
  source_year INTEGER,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS test_questions_scope_idx
  ON test_questions (
    exam_id,
    question_type,
    subject_name,
    lecture_title,
    sub_title,
    difficulty
  )
  WHERE is_active = TRUE;

-- Example MCQ insert.
-- Replace the strings and exam name with your real content.
INSERT INTO test_questions (
  exam_id,
  subject_name,
  lecture_title,
  sub_title,
  question_type,
  question_text,
  option_a,
  option_b,
  option_c,
  option_d,
  correct_option,
  explanation,
  difficulty
)
SELECT
  exams.id,
  'Polity',
  'Constitution',
  'Preamble',
  'mcqs',
  'Which word in the Preamble describes India as having no official religion?',
  'Republic',
  'Secular',
  'Sovereign',
  'Democratic',
  'B',
  'Secular means the state does not adopt an official religion.',
  'easy'
FROM exams
WHERE LOWER(exams.name) = LOWER('UPSC')
LIMIT 1;

-- Example PYQ insert.
INSERT INTO test_questions (
  exam_id,
  subject_name,
  lecture_title,
  sub_title,
  question_type,
  question_text,
  option_a,
  option_b,
  option_c,
  option_d,
  correct_option,
  explanation,
  difficulty,
  source_year
)
SELECT
  exams.id,
  'Polity',
  'Constitution',
  'Preamble',
  'pyqs',
  'A constitutional term from the Preamble is best matched with which option?',
  'Secular',
  'Monarchy',
  'Colony',
  'Protectorate',
  'A',
  'The inserted PYQ row can keep the source year for filtering and display.',
  'exam',
  2024
FROM exams
WHERE LOWER(exams.name) = LOWER('UPSC')
LIMIT 1;
