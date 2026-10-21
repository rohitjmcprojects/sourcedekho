import Link from "next/link";
import { sql } from "@/lib/db";

type ExamRow = {
  id: number;
  name: string;
  description: string | null;
};

type SyllabusRow = {
  id: number;
  exam_id: number | null;
  course_id: number | null;
  stage: string | null;
  paper: string | null;
  subject: string | null;
  theme: string | null;
  topic: string | null;
  video_name: string | null;
  video_url: string | null;
  notes_name: string | null;
  notes_url: string | null;
  mcqtest_name: string | null;
  mcqtest_url: string | null;
  pyq_name: string | null;
  pyq_url: string | null;
};

type SubjectFallbackRow = {
  id: number;
  course_id: number | null;
  title?: string | null;
  name?: string | null;
  subject_name?: string | null;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default async function SyllabusWisePage({
  params,
}: {
  params: Promise<{ exam: string }>;
}) {
  const { exam } = await params;
  const examSlug = exam ?? "";

  let selectedExam: ExamRow | null = null;
  let syllabusRows: SyllabusRow[] = [];

  try {
    const exams = await sql<ExamRow[]>`
      SELECT id, name, description
      FROM exams
      ORDER BY name ASC
    `;

    selectedExam = exams.find((item) => slugify(item.name) === examSlug) ?? null;

    if (selectedExam) {
      const subjectColumns = await sql<{ column_name: string }[]>`
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'subjects'
      `;

      const subjectColumnNames = new Set(subjectColumns.map((column) => column.column_name));
      const hasStageColumn = subjectColumnNames.has("stage");
      const hasPaperColumn = subjectColumnNames.has("paper");

      if (hasStageColumn || hasPaperColumn) {
        const rows = await sql<any[]>`
          SELECT s.*
          FROM subjects s
          INNER JOIN courses c ON c.id = s.course_id
          WHERE c.exam_id = ${selectedExam.id}
        `;

        syllabusRows = rows.map((row) => ({
          id: Number(row.id),
          exam_id: selectedExam?.id ?? null,
          course_id: row.course_id ?? null,
          stage: row.stage ?? row.subject_stage ?? null,
          paper: row.paper ?? row.paper_name ?? null,
          subject: row.subject ?? row.subject_name ?? row.title ?? row.name ?? null,
          theme: null,
          topic: null,
          video_name: null,
          video_url: null,
          notes_name: null,
          notes_url: null,
          mcqtest_name: null,
          mcqtest_url: null,
          pyq_name: null,
          pyq_url: null,
        }));
      } else {
        const hasSyllabusTable = await sql<{ exists: boolean }[]>`
          SELECT EXISTS (
            SELECT 1
            FROM information_schema.tables
            WHERE table_schema = 'public' AND table_name = 'syllabus_wise'
          ) AS exists
        `;

        if (hasSyllabusTable[0]?.exists) {
          syllabusRows = await sql<SyllabusRow[]>`
            SELECT *
            FROM syllabus_wise
            WHERE exam_id = ${selectedExam.id}
            ORDER BY stage ASC, paper ASC, subject ASC
          `;
        } else {
          const fallbackRows = await sql<SubjectFallbackRow[]>`
            SELECT s.*
            FROM subjects s
            INNER JOIN courses c ON c.id = s.course_id
            WHERE c.exam_id = ${selectedExam.id}
          `;

          syllabusRows = fallbackRows.map((row) => ({
            id: row.id,
            exam_id: selectedExam?.id ?? null,
            course_id: row.course_id,
            stage: null,
            paper: null,
            subject: row.title ?? row.name ?? row.subject_name ?? null,
            theme: null,
            topic: null,
            video_name: null,
            video_url: null,
            notes_name: null,
            notes_url: null,
            mcqtest_name: null,
            mcqtest_url: null,
            pyq_name: null,
            pyq_url: null,
          }));
        }
      }
    }
  } catch (error) {
    console.error("Failed to load syllabus-wise data:", error);
  }

  const stages = Array.from(
    new Set(syllabusRows.filter((row) => row.stage).map((row) => String(row.stage)))
  )
    .map((stageName) => ({
      name: stageName,
      papers: Array.from(
        new Set(
          syllabusRows
            .filter((row) => String(row.stage) === stageName)
            .map((row) => String(row.paper || "Untitled paper"))
        )
      ).sort(),
    }))
    .filter((stage) => stage.papers.length > 0);

  if (stages.length === 0 && syllabusRows.length > 0) {
    const fallbackStage = "General";
    const papers = Array.from(
      new Set(syllabusRows.map((row) => String(row.paper || "Untitled paper")))
    ).sort();

    if (papers.length > 0) {
      stages.push({ name: fallbackStage, papers });
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f8f6f2_0%,_#f2efe9_32%,_#eef0f3_100%)] px-0 py-0 text-slate-900">
      <div className="w-full px-4 py-6 md:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link href={`/courses/${examSlug}`} className="text-sm font-medium text-slate-700 hover:text-slate-900">
            ← Back to categories
          </Link>
        </div>

        <div className="mb-8 text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            {selectedExam?.name ?? "Exam"}
          </p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">Syllabus-wise</h1>
        </div>

        {stages.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-10 text-center text-sm text-slate-600 backdrop-blur-sm">
            No syllabus-wise subjects are available yet.
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {stages.map((stage) => (
              <div
                key={stage.name}
                className="group relative flex h-auto w-full max-w-[390px] flex-col gap-3 rounded-[26px] border border-white/80 bg-white/15 p-4 shadow-[0_18px_35px_-22px_rgba(15,23,42,0.5)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:drop-shadow-[0_20px_30px_rgba(15,23,42,0.12)]"
              >
                <div className="flex items-center gap-3">
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl shadow-inner shadow-slate-200/60">
                    <img src="/hcs.png" alt={stage.name} className="h-12 w-auto object-contain" />
                  </div>

                  <div className="text-left">
                    <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                      Stage
                    </div>
                    <div className="text-[15px] font-medium leading-5 text-slate-700">
                      {stage.name}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 rounded-2xl bg-slate-50 p-3">
                  {stage.papers.map((paper) => (
                    <Link
                      key={paper}
                      href={`/courses/${examSlug}/syllabus-wise/${slugify(paper)}`}
                      className="block rounded-xl border border-slate-200 bg-white px-2 py-2 text-[12px] font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
                    >
                      {paper}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
