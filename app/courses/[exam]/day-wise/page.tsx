import Link from "next/link";
import { sql } from "@/lib/db";

type ExamRow = {
  id: number;
  name: string;
  description: string | null;
};

type DayWiseContentRow = {
  id: number;
  syllabus_wise_id: number;
  medium: "Hindi" | "English";
  subject_name: string | null;
  theme: string | null;
  topic: string | null;
  day_number: number;
  category: "fresh" | "revision" | "test" | null;
  content_type: "video" | "notes" | "mcq" | "pyq" | null;
  display_name: string | null;
  content_name: string | null;
  content_url: string | null;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function categoryLabel(category: DayWiseContentRow["category"]) {
  switch (category) {
    case null:
      return "Uncategorized";
    case "fresh":
      return "New Learning";
    case "revision":
      return "Revision";
    case "test":
      return "Test";
  }
}

const categoryConfig = {
  fresh: {
    title: "New Learning",
    panel: "border-emerald-200 bg-emerald-50/60",
    heading: "text-emerald-800",
    link: "text-emerald-800 hover:text-emerald-950 hover:bg-emerald-100",
    dot: "bg-emerald-500",
  },
  revision: {
    title: "Revision",
    panel: "border-amber-200 bg-amber-50/60",
    heading: "text-amber-800",
    link: "text-amber-800 hover:text-amber-950 hover:bg-amber-100",
    dot: "bg-amber-500",
  },
  test: {
    title: "Test",
    panel: "border-violet-200 bg-violet-50/60",
    heading: "text-violet-800",
    link: "text-violet-800 hover:text-violet-950 hover:bg-violet-100",
    dot: "bg-violet-500",
  },
} as const;

function renderCategorySection(
  category: Exclude<DayWiseContentRow["category"], null>,
  selectedDayRows: DayWiseContentRow[]
) {
  const categoryRows = selectedDayRows.filter(
    (row) => row.category === category
  );
  const config = categoryConfig[category];

  // Group assigned content types by their syllabus_wise record.
  const groupedRows = Array.from(
    categoryRows.reduce((groups, row) => {
      const existing = groups.get(row.syllabus_wise_id) ?? [];
      existing.push(row);
      groups.set(row.syllabus_wise_id, existing);
      return groups;
    }, new Map<number, DayWiseContentRow[]>()).entries()
  );

  const contentLabels: Record<
    NonNullable<DayWiseContentRow["content_type"]>,
    string
  > = {
    video: "Video",
    notes: "Notes",
    mcq: "MCQs",
    pyq: "PYQs",
  };

  return (
    <section className={`rounded-2xl border p-4 md:p-5 ${config.panel}`}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className={`text-sm font-bold uppercase tracking-[0.12em] ${config.heading}`}>
          {config.title}
        </h3>
        <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-600">
          {groupedRows.length} {groupedRows.length === 1 ? "item" : "items"}
        </span>
      </div>

      {groupedRows.length > 0 ? (
        <div className="space-y-2">
          {groupedRows.map(([syllabusId, rows]) => {
            const firstRow = rows[0];
            const displayName = [
              firstRow.subject_name,
              firstRow.theme,
              firstRow.topic,
            ]
              .filter((part) => part && part.trim())
              .join(" - ") || firstRow.content_name || "Untitled topic";
            const availableLinks = rows.filter(
              (row) => row.content_type && row.content_url
            );

            return (
              <div
                key={syllabusId}
                className="flex flex-col gap-2 rounded-xl border border-white/80 px-4 py-3 shadow-sm sm:flex-row sm:flex-wrap sm:items-center"
              >
                <div className="flex min-w-0 items-start gap-2">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-slate-500" aria-hidden="true" />
                  <span className="text-sm font-semibold text-slate-800">
                    {displayName}
                  </span>
                </div>

                {availableLinks.length > 0 ? (
                  <div className="flex flex-wrap items-center gap-2">
                    {availableLinks.map((row) => (
                      <a
                        key={row.id}
                        href={row.content_url!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-1 rounded-lg bg-white/90 px-2.5 py-1 text-xs font-semibold underline-offset-4 shadow-sm hover:underline ${config.link}`}
                      >
                        {contentLabels[row.content_type!]}
                        <span aria-hidden="true">↗</span>
                      </a>
                    ))}
                  </div>
                ) : (
                  <span className="w-fit rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-400">
                    Coming Soon
                  </span>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-white/90 bg-white/60 px-4 py-5 text-sm text-slate-500">
          No {categoryLabel(category).toLowerCase()} available for this day.
        </div>
      )}
    </section>
  );
}

export default async function DayWisePage({
  params,
  searchParams,
}: {
  params: Promise<{ exam: string }>;
  searchParams?: Promise<{ day?: string; medium?: string }>;
}) {
  const { exam } = await params;
  const examSlug = exam ?? "";
  const { day, medium } = (await searchParams) ?? {};
  const selectedMedium: "Hindi" | "English" =
    medium?.toLowerCase() === "hindi" ? "Hindi" : "English";

  let selectedExam: ExamRow | null = null;
  let dayRows: DayWiseContentRow[] = [];

  try {
    const exams = await sql<ExamRow[]>`
      SELECT id, name, description
      FROM exams
      ORDER BY name ASC
    `;

    selectedExam =
      exams.find((item) => slugify(item.name) === examSlug) ?? null;

    if (selectedExam) {
      dayRows = await sql<DayWiseContentRow[]>`
        SELECT
          dw.id,
          dw.syllabus_wise_id,
          dw.medium,
          s.subject_name,
          sw.theme,
          sw.topic,
          COALESCE(NULLIF(sw.topic, ''), NULLIF(sw.theme, '')) AS display_name,
          dw.day_number,
          dw.category,
          dw.content_type,
          CASE dw.content_type
            WHEN 'video' THEN sw.video_name
            WHEN 'notes' THEN sw.notes_name
            WHEN 'mcq' THEN sw.mcqtest_name
            WHEN 'pyq' THEN sw.pyq_name
            ELSE NULL
          END AS content_name,
          CASE dw.content_type
            WHEN 'video' THEN sw.video_url
            WHEN 'notes' THEN sw.notes_url
            WHEN 'mcq' THEN sw.mcqtest_url
            WHEN 'pyq' THEN sw.pyq_url
            ELSE NULL
          END AS content_url
        FROM day_wise AS dw
        INNER JOIN syllabus_wise AS sw
          ON sw.id = dw.syllabus_wise_id
        INNER JOIN subjects AS s
          ON s.id = sw.subject_id
        WHERE s.exam_id = ${selectedExam.id}
          AND dw.medium = ${selectedMedium}
        ORDER BY
          dw.day_number ASC,
          CASE dw.category
            WHEN 'fresh' THEN 1
            WHEN 'revision' THEN 2
            WHEN 'test' THEN 3
            ELSE 4
          END,
          sw.theme ASC,
          sw.topic ASC,
          dw.id ASC
      `;
    }
  } catch (error) {
    console.error("Failed to load day-wise content:", error);
  }

  const availableDays = Array.from(
    new Set(
      dayRows
        .map((row) => Number(row.day_number))
        .filter((value) => Number.isFinite(value) && value > 0)
    )
  ).sort((a, b) => a - b);

  // The URL contains values such as "day-1". Extract the numeric day safely.
  const requestedDayMatch = day?.match(/\d+/);
  const requestedDay = requestedDayMatch ? Number(requestedDayMatch[0]) : NaN;

  const selectedDayNumber = availableDays.includes(requestedDay)
    ? requestedDay
    : availableDays[0] ?? 1;

  const dayOptions = availableDays.map((dayNumber) => {
    // A day is red if at least one record for it has a NULL category.
    const hasNullCategory = dayRows.some(
      (row) => Number(row.day_number) === dayNumber && row.category === null
    );

    return {
      key: `day-${dayNumber}`,
      label: `Day ${dayNumber}`,
      date: dayNumber,
      hasNullCategory,
    };
  });

  const selectedDayRows = dayRows.filter(
    (row) => Number(row.day_number) === selectedDayNumber
  );

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f8f6f2_0%,_#f2efe9_32%,_#eef0f3_100%)] px-0 py-0 text-slate-900">
      <div className="w-full px-4 py-6 md:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <Link
            href={`/courses/${examSlug}`}
            className="text-sm font-medium text-slate-700 hover:text-slate-900"
          >
            ← Back to Courses
          </Link>

          <div className="inline-flex h-10 items-center gap-3 rounded-full border border-slate-200 bg-white px-3 shadow-sm">
            <span
              className={`whitespace-nowrap text-[13px] font-semibold ${
                selectedMedium === "Hindi" ? "text-teal-600" : "text-slate-400"
              }`}
            >
              हिंदी मीडियम
            </span>

            <Link
              href={`/courses/${examSlug}/day-wise?day=day-${selectedDayNumber}&medium=${selectedMedium === "Hindi" ? "english" : "hindi"}`}
              role="switch"
              aria-checked={selectedMedium === "Hindi"}
              aria-label="Switch between Hindi and English medium"
              className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-200 ${
                selectedMedium === "Hindi" ? "bg-teal-600" : "bg-slate-300"
              }`}
            >
              <span
                className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                  selectedMedium === "Hindi" ? "translate-x-1" : "translate-x-6"
                }`}
              />
            </Link>

            <span
              className={`whitespace-nowrap text-[13px] font-semibold ${
                selectedMedium === "English" ? "text-teal-600" : "text-slate-400"
              }`}
            >
              English Medium
            </span>
          </div>

          <a
            href="https://forms.gle/NVYP9q8KmGmG22CG9"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 10h8M8 14h5m-8 6 3.2-3H18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 1 2Z"
              />
            </svg>
            Raise a Query
          </a>
        </div>

        <div className="mb-8 text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            {selectedExam?.name ?? "Exam"}
          </p>
        </div>

        <div className="grid gap-6 rounded-[30px] border border-white/70 lg:grid-cols-[300px_minmax(0,1fr)] lg:p-6">
          <aside className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4 shadow-inner shadow-slate-200/60">
            <div className="mb-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                Select Day
              </p>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {dayOptions.length === 0 ? (
                <div className="col-span-5 rounded-xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-600">
                  No day-wise records available.
                </div>
              ) : (
                dayOptions.map((option) => {
                  const isActive = option.date === selectedDayNumber;

                  return (
                    <Link
                      key={option.key}
                      href={`/courses/${examSlug}/day-wise?day=${option.key}&medium=${selectedMedium.toLowerCase()}`}
                      className={`flex h-11 items-center justify-center rounded-xl border text-sm font-semibold transition-all ${
                        option.hasNullCategory
                          ? isActive
                            ? "border-red-700 bg-red-600 text-white shadow-md shadow-red-900/15"
                            : "border-red-200 bg-red-50 text-red-700 hover:border-red-300 hover:bg-red-100"
                          : isActive
                            ? "border-emerald-700 bg-emerald-600 text-white shadow-md shadow-emerald-900/15"
                            : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-300 hover:bg-emerald-100"
                      }`}
                      aria-label={`Select ${option.label}`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {option.date}
                    </Link>
                  );
                })
              )}
            </div>
          </aside>

          <section className="min-w-0 rounded-[24px] border border-slate-200  p-5 shadow-[0_18px_35px_-25px_rgba(15,23,42,0.45)] md:p-7">
            <div className="mb-6 flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Day-wise learning plan
                </p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  Day {selectedDayNumber}
                </h2>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {selectedDayRows.length} resources
              </span>
            </div>

            {selectedDayRows.length > 0 ? (
              <div className="flex flex-col gap-5">
                {renderCategorySection("fresh", selectedDayRows)}
                {renderCategorySection("revision", selectedDayRows)}
                {renderCategorySection("test", selectedDayRows)}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                <p className="text-sm font-semibold text-slate-700">
                  No content available for Day {selectedDayNumber}.
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Please check another day or come back later.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
