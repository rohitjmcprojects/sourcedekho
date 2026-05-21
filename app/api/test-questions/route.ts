import { sql } from "@/lib/db";
import type {
  AttemptOption,
  AttemptQuestion,
} from "@/lib/testQuestions";
import type {
  TestLauncherScope,
  TestType,
} from "@/components/TestLauncherModal";

type QuestionDifficulty =
  | "easy"
  | "mixed"
  | "exam";

type QuestionRequest = {
  scope: TestLauncherScope;
  questionCount: number;
  difficulty: QuestionDifficulty;
};

type QuestionRow = {
  id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: "A" | "B" | "C" | "D";
  explanation: string | null;
  marks: string | number;
};

const optionKeys = [
  "A",
  "B",
  "C",
  "D",
] as const;

function isTestType(value: unknown): value is TestType {
  return value === "mcqs" || value === "pyqs";
}

function isDifficulty(
  value: unknown
): value is QuestionDifficulty {
  return (
    value === "easy" ||
    value === "mixed" ||
    value === "exam"
  );
}

function isScope(
  value: unknown
): value is TestLauncherScope {
  if (!value || typeof value !== "object") {
    return false;
  }

  const scope = value as Record<
    string,
    unknown
  >;

  return (
    typeof scope.exam === "string" &&
    typeof scope.subject === "string" &&
    typeof scope.lectureTitle === "string" &&
    typeof scope.subTitle === "string" &&
    isTestType(scope.type)
  );
}

function isQuestionRequest(
  value: unknown
): value is QuestionRequest {
  if (!value || typeof value !== "object") {
    return false;
  }

  const body = value as Record<
    string,
    unknown
  >;

  return (
    isScope(body.scope) &&
    typeof body.questionCount === "number" &&
    isDifficulty(body.difficulty)
  );
}

function optionsForRow(
  row: QuestionRow
): AttemptOption[] {
  return [
    {
      id: `${row.id}-A`,
      label: row.option_a,
    },
    {
      id: `${row.id}-B`,
      label: row.option_b,
    },
    {
      id: `${row.id}-C`,
      label: row.option_c,
    },
    {
      id: `${row.id}-D`,
      label: row.option_d,
    },
  ];
}

function toQuestion(
  row: QuestionRow
): AttemptQuestion {
  const correctKey =
    optionKeys.find(
      (key) =>
        key === row.correct_option
    ) || "A";

  return {
    id: `db-question-${row.id}`,
    prompt: row.question_text,
    options: optionsForRow(row),
    correctOptionId: `${row.id}-${correctKey}`,
    explanation:
      row.explanation ||
      "Explanation not added yet.",
    marks: Number(row.marks) || 1,
  };
}

export async function POST(request: Request) {
  const body: unknown = await request.json();

  if (!isQuestionRequest(body)) {
    return Response.json(
      {
        error:
          "Invalid test question request.",
      },
      { status: 400 }
    );
  }

  const questionCount = Math.min(
    100,
    Math.max(
      1,
      Math.floor(body.questionCount)
    )
  );
  const difficulty =
    body.difficulty === "mixed"
      ? null
      : body.difficulty;

  try {
    const rows = (await sql`
      SELECT
        test_questions.id::text AS id,
        test_questions.question_text,
        test_questions.option_a,
        test_questions.option_b,
        test_questions.option_c,
        test_questions.option_d,
        test_questions.correct_option,
        test_questions.explanation,
        test_questions.marks
      FROM test_questions
      JOIN exams
        ON exams.id = test_questions.exam_id
      WHERE test_questions.is_active = TRUE
        AND LOWER(exams.name) = LOWER(${body.scope.exam})
        AND LOWER(test_questions.subject_name) = LOWER(${body.scope.subject})
        AND LOWER(test_questions.lecture_title) = LOWER(${body.scope.lectureTitle})
        AND LOWER(test_questions.sub_title) = LOWER(${body.scope.subTitle})
        AND test_questions.question_type = ${body.scope.type}
        AND (
          ${difficulty}::text IS NULL
          OR test_questions.difficulty = ${difficulty}
        )
      ORDER BY RANDOM()
      LIMIT ${questionCount}
    `) as QuestionRow[];

    return Response.json({
      questions: rows.map(toQuestion),
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error:
          "Question bank is not ready. Run sql/test-questions.sql and add questions first.",
      },
      { status: 500 }
    );
  }
}
