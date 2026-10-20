import Link from "next/link";
import { sql } from "@/lib/db";

type ExamRow = {
  id: number;
  name: string;
  description: string | null;
};

type CourseRow = {
  id: number;
  exam_id: number | null;
  category: string;
  title: string;
  description: string | null;
  price: number | null;
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
  let courseRows: CourseRow[] = [];

  try {
    const exams = await sql<ExamRow[]>`
      SELECT id, name, description
      FROM exams
      ORDER BY name ASC
    `;

    selectedExam = exams.find((item) => slugify(item.name) === examSlug) ?? null;

    if (selectedExam) {
      courseRows = await sql<CourseRow[]>`
        SELECT id, exam_id, category, title, description, price
        FROM courses
        WHERE exam_id = ${selectedExam.id}
          AND category ILIKE '%syllabus%'
        ORDER BY title ASC
      `;
    }
  } catch (error) {
    console.error("Failed to load syllabus-wise courses:", error);
  }

  const stages = [
    {
      name: "Prelims",
      papers: [
        "Paper 1 - GS",
        "Paper 2 - CSAT",
      ],
    },
    {
      name: "Mains",
      papers: [
        "Paper 1 - English",
        "Paper 2 - Hindi",
        "Paper 3 - GS I",
        "Paper 4 - GS II",
        "Paper 5 - GS III",
        "Paper 6 - GS IV",
      ],
    },
    {
      name: "Personality Test",
      papers: [
        "Interview / Personality Test",
      ],
    },
  ];

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

        {courseRows.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-10 text-center text-sm text-slate-600 backdrop-blur-sm">
            No syllabus-wise courses are available yet.
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {stages.map((stage) => (
              <div
                key={stage.name}
                className="group relative flex h-auto w-full max-w-[390px] flex-col gap-3 rounded-[26px] border border-white/80 bg-white/15 p-4 shadow-[0_18px_35px_-22px_rgba(15,23,42,0.5)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:drop-shadow-[0_20px_30px_rgba(15,23,42,0.12)]"
              >
                <div className="flex items-center gap-3">
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-100 shadow-inner shadow-slate-200/60">
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
                    <div
                      key={paper}
                      className="rounded-xl border border-slate-200 bg-white px-2 py-2 text-[12px] font-medium text-slate-700"
                    >
                      {paper}
                    </div>
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
