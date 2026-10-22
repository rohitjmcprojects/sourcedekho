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

type SubjectTableRow = {
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

function ResourceLink({
  label,
  url,
  name,
}: {
  label: string;
  url: string | null;
  name: string | null;
}) {
  if (!url) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
    >
      {name || label}
    </a>
  );
}

export default async function SyllabusPaperPage({
  params,
  searchParams,
}: {
  params: Promise<{ exam: string; paper: string }>;
  searchParams?: Promise<{ subject?: string }>;
}) {
  const { exam, paper } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const examSlug = exam ?? "";
  const paperSlug = paper ?? "";

  let selectedExam: ExamRow | null = null;
  let syllabusRows: SyllabusRow[] = [];
  let subjectNames: string[] = [];
  let selectedPaper = "";
  let selectedSubject = "";

  try {
    const exams = await sql<ExamRow[]>`
      SELECT id, name, description
      FROM exams
      ORDER BY name ASC
    `;

    selectedExam = exams.find((item) => slugify(item.name) === examSlug) ?? null;

    if (selectedExam) {
      const rows = await sql<SyllabusRow[]>`
        SELECT *
        FROM syllabus_wise
        WHERE exam_id = ${selectedExam.id}
        ORDER BY subject ASC, topic ASC, paper ASC
      `;

      const matchedPaper = rows.find((row) => slugify(String(row.paper ?? "")) === paperSlug);
      selectedPaper = matchedPaper?.paper ?? "";

      syllabusRows = rows.filter((row) => row.paper === selectedPaper);

      const subjectRows = await sql<any[]>`
        SELECT s.*
        FROM subjects s
        INNER JOIN courses c ON c.id = s.course_id
        WHERE c.exam_id = ${selectedExam.id}
      `;

      const normalizeSubjectName = (row: any) =>
        String(row?.title ?? row?.name ?? row?.subject_name ?? row?.subject ?? "").trim();

      const exactPaperSubjectRows = subjectRows.filter((row) => {
        const rowPaper = row?.paper ?? row?.paper_name ?? row?.subject_paper ?? "";
        const rowStage = row?.stage ?? row?.subject_stage ?? "";

        const isMatchingPaper =
          !rowPaper ||
          String(rowPaper).trim() === selectedPaper.trim() ||
          slugify(String(rowPaper)) === paperSlug;

        const isMatchingStage =
          !rowStage ||
          !syllabusRows[0]?.stage ||
          String(rowStage).trim() === String(syllabusRows[0]?.stage).trim();

        return isMatchingPaper && isMatchingStage;
      });

      const exactPaperSubjectValues = exactPaperSubjectRows
        .map((row) => normalizeSubjectName(row))
        .filter(Boolean);

      const subjectValues = subjectRows
        .map((row) => normalizeSubjectName(row))
        .filter(Boolean);

      const paperSubjectValues = Array.from(
        new Set(
          syllabusRows
            .map((row) => String(row.subject ?? "").trim())
            .filter(Boolean)
        )
      );

      const allowedSubjectNames =
        exactPaperSubjectValues.length > 0
          ? new Set(exactPaperSubjectValues)
          : paperSubjectValues.length > 0
            ? new Set(paperSubjectValues)
            : new Set(subjectValues);

      subjectNames = Array.from(new Set(subjectValues.filter((value) => allowedSubjectNames.has(value))))
        .sort((a, b) => a.localeCompare(b));

      if (subjectNames.length === 0) {
        subjectNames = Array.from(new Set(subjectValues)).sort((a, b) => a.localeCompare(b));
      }

      const requestedSubject = resolvedSearchParams?.subject ?? "";
      const normalizedRequestedSubject = requestedSubject.trim();
      const matchedSubject = subjectNames.find((subjectName) => {
        const current = String(subjectName).trim();
        return (
          current.toLowerCase() === normalizedRequestedSubject.toLowerCase() ||
          slugify(current) === slugify(normalizedRequestedSubject)
        );
      });

      selectedSubject = matchedSubject ?? subjectNames[0] ?? "";
    }
  } catch (error) {
    console.error("Failed to load syllabus paper dashboard:", error);
  }

  const subjectContentRows = selectedSubject
    ? syllabusRows.filter((row) => {
        const rowSubject = String(row.subject ?? "").trim();
        return (
          rowSubject.toLowerCase() === selectedSubject.toLowerCase() ||
          slugify(rowSubject) === slugify(selectedSubject)
        );
      })
    : syllabusRows;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f8f6f2_0%,_#f2efe9_32%,_#eef0f3_100%)] px-0 py-0 text-slate-900">
      <div className="w-full px-4 py-6 md:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link href={`/courses/${examSlug}/syllabus-wise`} className="text-sm font-medium text-slate-700 hover:text-slate-900">
            ← Back to syllabus
          </Link>
        </div>

        <div className="mb-8 text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            {selectedExam?.name ?? "Exam"} __ {selectedPaper || "Paper"} __{selectedSubject || selectedPaper || "Selected paper"}
          </p>
        </div>

        {subjectNames.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-10 text-center text-sm text-slate-600 backdrop-blur-sm">
            No syllabus content is available for this paper yet.
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
            <aside className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4 shadow-inner shadow-slate-200/60">
              <div className="mb-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Subjects</p>
              </div>

              <div className="space-y-2">
                {subjectNames.map((subjectName) => {
                  const isSelected = subjectName === selectedSubject;

                  return (
                    <Link
                      key={subjectName}
                      href={`/courses/${examSlug}/syllabus-wise/${paperSlug}?subject=${encodeURIComponent(subjectName)}`}
                      className={[
                        "block rounded-xl border px-3 py-2 text-sm font-medium transition",
                        isSelected
                          ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-100",
                      ].join(" ")}
                    >
                      {subjectName}
                    </Link>
                  );
                })}
              </div>
            </aside>

            <section className="rounded-[24px] border border-slate-200 ">
              

              {subjectContentRows.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-600">
                  No syllabus content is available for this subject yet.
                </div>
              ) : (
                <div className="space-y-5">
                  {subjectContentRows.map((row) => (
                    <div key={row.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <div>
                          
                          {row.theme ? (
                            <div className="mt-1 text-sm font-medium text-slate-700">{row.theme}</div>
                          ) : null}
                          {row.topic ? (
                            <div className="mt-1 text-sm text-slate-600">{row.topic}</div>
                          ) : null}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <ResourceLink label="Video" url={row.video_url} name={row.video_name} />
                        <ResourceLink label="Notes" url={row.notes_url} name={row.notes_name} />
                        <ResourceLink label="MCQ Test" url={row.mcqtest_url} name={row.mcqtest_name} />
                        <ResourceLink label="PYQ" url={row.pyq_url} name={row.pyq_name} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
