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
  stage: string | null;
  paper: string | null;
  subject: string | null;
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
  if (!name) return null;

  const isAvailable = Boolean(url);

  return (
    <a
      href={isAvailable ? url ?? undefined : undefined}
      target={isAvailable ? "_blank" : undefined}
      rel={isAvailable ? "noreferrer" : undefined}
      aria-disabled={!isAvailable}
      className={[
        "inline-flex items-center text-sm font-medium underline-offset-2 transition",
        isAvailable
          ? "text-emerald-700 hover:text-emerald-800 hover:underline"
          : "text-red-600 hover:text-red-700 hover:underline",
      ].join(" ")}
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
      const subjectRows = await sql<SubjectTableRow[]>`
        SELECT
          s.id,
          COALESCE(TO_JSONB(s) ->> 'stage', TO_JSONB(s) ->> 'subject_stage') AS stage,
          COALESCE(TO_JSONB(s) ->> 'paper', TO_JSONB(s) ->> 'paper_name') AS paper,
          COALESCE(
            TO_JSONB(s) ->> 'title',
            TO_JSONB(s) ->> 'subject_name',
            TO_JSONB(s) ->> 'name'
          ) AS subject
        FROM subjects AS s
        LEFT JOIN courses AS c ON c.id = s.course_id
        WHERE COALESCE(NULLIF(TO_JSONB(s) ->> 'exam_id', ''), c.exam_id::text) = ${String(selectedExam.id)}
        ORDER BY stage ASC, paper ASC, subject ASC
      `;

      const rows = await sql<SyllabusRow[]>`
        SELECT
          sw.id,
          COALESCE(NULLIF(TO_JSONB(s) ->> 'exam_id', ''), c.exam_id::text)::integer AS exam_id,
          s.course_id,
          COALESCE(TO_JSONB(s) ->> 'stage', TO_JSONB(s) ->> 'subject_stage') AS stage,
          COALESCE(TO_JSONB(s) ->> 'paper', TO_JSONB(s) ->> 'paper_name') AS paper,
          COALESCE(
            TO_JSONB(s) ->> 'title',
            TO_JSONB(s) ->> 'subject_name',
            TO_JSONB(s) ->> 'name'
          ) AS subject,
          sw.theme,
          sw.topic,
          sw.video_name,
          sw.video_url,
          sw.notes_name,
          sw.notes_url,
          sw.mcqtest_name,
          sw.mcqtest_url,
          sw.pyq_name,
          sw.pyq_url
        FROM syllabus_wise AS sw
        INNER JOIN subjects AS s ON s.id = sw.subject_id
        LEFT JOIN courses AS c ON c.id = s.course_id
        WHERE COALESCE(NULLIF(TO_JSONB(s) ->> 'exam_id', ''), c.exam_id::text) = ${String(selectedExam.id)}
        ORDER BY subject ASC, sw.topic ASC, paper ASC
      `;

      const matchedPaper = subjectRows.find((row) => slugify(String(row.paper ?? "")) === paperSlug);
      selectedPaper = matchedPaper?.paper ?? "";

      syllabusRows = rows.filter((row) => row.paper === selectedPaper);

      subjectNames = Array.from(
        new Set(
          subjectRows
            .filter((row) => row.paper === selectedPaper)
            .map((row) => String(row.subject ?? "").trim())
            .filter(Boolean)
        )
      ).sort((a, b) => a.localeCompare(b));

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

  const subjectDataMap = new Map<string, boolean>();
  subjectNames.forEach((subjectName) => {
    const hasData = syllabusRows.some((row) => {
      const rowSubject = String(row.subject ?? "").trim();
      return (
        rowSubject &&
        (rowSubject.toLowerCase() === subjectName.toLowerCase() ||
          slugify(rowSubject) === slugify(subjectName))
      );
    });

    subjectDataMap.set(subjectName, hasData);
  });

  const subjectContentRows = selectedSubject
    ? syllabusRows.filter((row) => {
        const rowSubject = String(row.subject ?? "").trim();
        return (
          rowSubject.toLowerCase() === selectedSubject.toLowerCase() ||
          slugify(rowSubject) === slugify(selectedSubject)
        );
      })
    : syllabusRows;

  const themeGroups = Array.from(
    subjectContentRows.reduce((map, row) => {
      const themeName = String(row.theme ?? "General").trim() || "General";
      const existing = map.get(themeName) ?? [];
      existing.push(row);
      map.set(themeName, existing);
      return map;
    }, new Map<string, SyllabusRow[]>()).entries()
  ).sort(([a], [b]) => a.localeCompare(b));

  const totalThemes = themeGroups.length;
  const totalVideos = subjectContentRows.filter((row) => row.video_url).length;
  const totalNotes = subjectContentRows.filter((row) => row.notes_url).length;
  const totalTests = subjectContentRows.filter((row) => row.mcqtest_url || row.pyq_url).length;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f8f6f2_0%,_#f2efe9_32%,_#eef0f3_100%)] px-0 py-0 text-slate-900">
      <div className="w-full px-4 py-6 md:px-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            <span>{selectedExam?.name ?? "Exam"}</span>
            <span>/</span>
            <span>{selectedPaper || "Paper"}</span>
            {selectedSubject ? (
              <>
                <span>/</span>
                <span>{selectedSubject}</span>
              </>
            ) : null}
          </div>

          <div className="flex flex-col items-end gap-4">
            {subjectNames.length > 0 ? (
              <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:min-w-[430px] md:grid-cols-4">
              <div className="rounded-xl bg-white p-3 text-center shadow-sm">
                <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Themes</div>
                <div className="mt-2 text-2xl font-bold text-slate-900">{totalThemes}</div>
              </div>
              <div className="rounded-xl bg-white p-3 text-center shadow-sm">
                <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Videos</div>
                <div className="mt-2 text-2xl font-bold text-slate-900">{totalVideos}</div>
              </div>
              <div className="rounded-xl bg-white p-3 text-center shadow-sm">
                <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Notes</div>
                <div className="mt-2 text-2xl font-bold text-slate-900">{totalNotes}</div>
              </div>
                <div className="rounded-xl bg-white p-3 text-center shadow-sm">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Tests</div>
                  <div className="mt-2 text-2xl font-bold text-slate-900">{totalTests}</div>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {subjectNames.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-10 text-center text-sm text-slate-600 backdrop-blur-sm">
            No syllabus content is available for this paper yet.
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
            <aside className="rounded-[24px] border border-slate-400  p-4 shadow-inner shadow-slate-200/60">
              <div className="mb-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Subjects</p>
              </div>

              <div className="space-y-2">
                {subjectNames.map((subjectName) => {
                  const isSelected = subjectName === selectedSubject;
                  const hasData = subjectDataMap.get(subjectName) ?? false;

                  return (
                    <Link
                      key={subjectName}
                      href={`/courses/${examSlug}/syllabus-wise/${paperSlug}?subject=${encodeURIComponent(subjectName)}`}
                      className={[
                        "flex items-center justify-between gap-2 rounded-xl border px-3 py-2 text-sm font-medium text-slate-900 transition",
                        isSelected
                          ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                          : hasData
                            ? "border-emerald-200 bg-emerald-50 text-slate-900 hover:border-emerald-300 hover:bg-emerald-100"
                            : "border-red-200 bg-red-50 text-slate-900 hover:border-red-300 hover:bg-red-100",
                      ].join(" ")}
                    >
                      <span>{subjectName}</span>
                      {hasData ? (
                        <span
                          className={[
                            "inline-flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 shadow-sm",
                            isSelected ? "border-white bg-emerald-400 shadow-emerald-200/80" : "border-emerald-100 bg-emerald-500 shadow-emerald-200/80",
                          ].join(" ")}
                          title="Data available"
                          aria-label="Data available"
                        />
                      ) : (
                        <span
                          className={[
                            "inline-flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 shadow-sm",
                            isSelected ? "border-white bg-red-400 shadow-red-200/80" : "border-red-100 bg-red-500 shadow-red-200/80",
                          ].join(" ")}
                          title="No data available"
                          aria-label="No data available"
                        />
                      )}
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
                <div className="space-y-6">
                  {themeGroups.map(([themeName, rows]) => {
                    const topicGroups = Array.from(
                      rows.reduce((map, row) => {
                        const topicName = String(row.topic ?? "General").trim() || "General";
                        const existing = map.get(topicName) ?? [];
                        existing.push(row);
                        map.set(topicName, existing);
                        return map;
                      }, new Map<string, SyllabusRow[]>()).entries()
                    ).sort(([a], [b]) => a.localeCompare(b));

                    return (
                      <div key={themeName} className="rounded-2xl border border-slate-400 p-2">
                        <h3 className="text-lg font-bold text-slate-900">{themeName}</h3>
    
                        <div className="space-y-1">
                          {topicGroups.map(([topicName, topicRows]) => {
                            const videoLinks = topicRows
                              .map((row) => ({
                                id: row.id,
                                url: row.video_url,
                                name: row.video_name,
                              }))
                              .filter((item) => item.name);

                            const noteLinks = topicRows
                              .map((row) => ({
                                id: row.id,
                                url: row.notes_url,
                                name: row.notes_name,
                              }))
                              .filter((item) => item.name);

                            const mcqLinks = topicRows
                              .map((row) => ({
                                id: row.id,
                                url: row.mcqtest_url,
                                name: row.mcqtest_name,
                              }))
                              .filter((item) => item.name);

                            const pyqLinks = topicRows
                              .map((row) => ({
                                id: row.id,
                                url: row.pyq_url,
                                name: row.pyq_name,
                              }))
                              .filter((item) => item.name);

                            return (
                              <div key={`${themeName}-${topicName}`} className="rounded-xl border border-slate-200  p-3">
                                <div className="mb-3 text-sm font-semibold text-slate-700">{topicName}</div>

                                <div className="flex flex-col gap-0 overflow-hidden rounded-xl xl:flex-row xl:divide-x xl:divide-slate-500">
                                  <div className="flex-1 p-3">
                                    <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-900">
                                      Videos
                                    </div>
                                    <ul className="space-y-1 pl-4 text-sm text-slate-700">
                                      {videoLinks.length === 0 ? (
                                        <li className="text-slate-400">No videos</li>
                                      ) : (
                                        videoLinks.map((link) => (
                                          <li key={link.id} className="list-disc marker:text-slate-500">
                                            <ResourceLink label="Video" url={link.url} name={link.name} />
                                          </li>
                                        ))
                                      )}
                                    </ul>
                                  </div>

                                  <div className="flex-1 p-3">
                                    <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-900">
                                      Notes
                                    </div>
                                    <ul className="space-y-1 pl-4 text-sm text-slate-700">
                                      {noteLinks.length === 0 ? (
                                        <li className="text-slate-400">No notes</li>
                                      ) : (
                                        noteLinks.map((link) => (
                                          <li key={link.id} className="list-disc marker:text-slate-500">
                                            <ResourceLink label="Notes" url={link.url} name={link.name} />
                                          </li>
                                        ))
                                      )}
                                    </ul>
                                  </div>

                                  <div className="flex-1 p-3">
                                    <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-900">
                                      MCQ Test
                                    </div>
                                    <ul className="space-y-1 pl-4 text-sm text-slate-700">
                                      {mcqLinks.length === 0 ? (
                                        <li className="text-slate-400">No MCQ test</li>
                                      ) : (
                                        mcqLinks.map((link) => (
                                          <li key={link.id} className="list-disc marker:text-slate-500">
                                            <ResourceLink label="MCQ Test" url={link.url} name={link.name} />
                                          </li>
                                        ))
                                      )}
                                    </ul>
                                  </div>

                                  <div className="flex-1 p-3">
                                    <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-900">
                                      PYQ Test
                                    </div>
                                    <ul className="space-y-1 pl-4 text-sm text-slate-700">
                                      {pyqLinks.length === 0 ? (
                                        <li className="text-slate-400">No PYQ</li>
                                      ) : (
                                        pyqLinks.map((link) => (
                                          <li key={link.id} className="list-disc marker:text-slate-500">
                                            <ResourceLink label="PYQ" url={link.url} name={link.name} />
                                          </li>
                                        ))
                                      )}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
