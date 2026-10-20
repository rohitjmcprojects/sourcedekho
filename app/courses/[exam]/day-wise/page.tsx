import Link from "next/link";
import { sql } from "@/lib/db";

type ExamRow = {
  id: number;
  name: string;
  description: string | null;
};

type DayWiseRow = {
  id: number;
  exam_id: number | null;
  hcs: string | null;
  course_name: string | null;
  day_number: number | null;
  fresh_name: string | null;
  fresh_video_url: string | null;
  revision_name: string | null;
  revision_notes_url: string | null;
  mcqtest_name: string | null;
  mcqtest_url: string | null;
  pyqtest_name: string | null;
  pyqtest_url: string | null;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getDayMeta(dayIndex: number) {
  const dayMap = [
    {
      label: "Day 1",
      title: "Foundation & Basics",
      summary: "Start with core concepts, revision points, and a strong base for the exam." ,
      topics: ["Exam pattern overview", "Concept clarity", "Quick revision drills"],
    },
    {
      label: "Day 2",
      title: "Concept Strengthening",
      summary: "Deepen your understanding of fundamentals through focused practice and drills.",
      topics: ["Important theories", "Short-answer practice", "Common question patterns"],
    },
    {
      label: "Day 3",
      title: "Practice & Accuracy",
      summary: "Focus on solving questions with speed, precision, and better exam discipline.",
      topics: ["Timed practice", "Accuracy checks", "Error review"],
    },
    {
      label: "Day 4",
      title: "Advanced Revision",
      summary: "Refresh high-weight topics and improve recall with layered revision sessions.",
      topics: ["High-weight areas", "Revision cycle", "Mock analysis"],
    },
    {
      label: "Day 5",
      title: "Mock Test Readiness",
      summary: "Practise full exam conditions and improve time management before the test.",
      topics: ["Mock paper strategy", "Speed building", "Weakness mapping"],
    },
  ];

  return dayMap[dayIndex] ?? {
    label: `Day ${dayIndex + 1}`,
    title: "Targeted Learning",
    summary: "Continue with focused preparation and revision for better performance.",
    topics: ["Practice set", "Revision", "Confidence building"],
  };
}

export default async function DayWisePage({
  params,
  searchParams,
}: {
  params: Promise<{ exam: string }>;
  searchParams?: Promise<{ day?: string }>;
}) {
  const { exam } = await params;
  const examSlug = exam ?? "";
  const { day } = (await searchParams) ?? {};

  let selectedExam: ExamRow | null = null;
  let dayRows: DayWiseRow[] = [];

  try {
    const exams = await sql<ExamRow[]>`
      SELECT id, name, description
      FROM exams
      ORDER BY name ASC
    `;

    selectedExam = exams.find((item) => slugify(item.name) === examSlug) ?? null;

    if (selectedExam) {
      dayRows = await sql<DayWiseRow[]>`
        SELECT
          id,
          exam_id,
          hcs,
          course_name,
          day_number,
          fresh_name,
          fresh_video_url,
          revision_name,
          revision_notes_url,
          mcqtest_name,
          mcqtest_url,
          pyqtest_name,
          pyqtest_url
        FROM day_wise
        WHERE exam_id = ${selectedExam.id}
        ORDER BY day_number ASC
      `;
    }
  } catch (error) {
    console.error("Failed to load day-wise data:", error);
  }

  const availableDays = Array.from(
    new Set(
      dayRows
        .map((row) => Number(row.day_number))
        .filter((value) => Number.isFinite(value) && value > 0)
        .sort((a, b) => a - b)
    )
  );

  const dayOptions = availableDays.length
    ? availableDays.map((dayNumber) => ({
        key: `day-${dayNumber}`,
        label: `Day ${dayNumber}`,
        date: dayNumber,
      }))
    : [];

  const selectedDayNumber = Number(day?.replace(/\D/g, "")) || availableDays[0] || 1;
  const selectedDayKey = dayOptions.some((item) => item.key === day)
    ? (day ?? `day-${selectedDayNumber}`)
    : `day-${Math.min(selectedDayNumber, availableDays[0] || selectedDayNumber)}`;
  const selectedDayIndex = Math.max(0, Number((selectedDayKey ?? `day-${selectedDayNumber}`).replace(/\D/g, "")) - 1);
  const selectedMeta = getDayMeta(selectedDayIndex);

  const selectedDayRecord =
    dayRows.find((row) => Number(row.day_number) === Number((selectedDayKey ?? `day-${selectedDayNumber}`).replace(/\D/g, ""))) ?? dayRows[0] ?? null;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f8f6f2_0%,_#f2efe9_32%,_#eef0f3_100%)] px-0 py-0 text-slate-900">
      <div className="w-full px-4 py-6 md:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link href={`/courses/${examSlug}`} className="text-sm font-medium text-slate-700 hover:text-slate-900">
            ← Back to Courses
          </Link>
        </div>

        <div className="mb-8 text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            {selectedExam?.name ?? "Exam"}
          </p>
        </div>

        <div className="grid gap-6 rounded-[30px] border border-white/70  lg:grid-cols-[300px_minmax(0,1fr)] lg:p-6">
          <aside className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4 shadow-inner shadow-slate-200/60">
            <div className="mb-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Select Day</p>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {dayOptions.length === 0 ? (
                <div className="col-span-5 rounded-xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-600">
                  No day-wise records available.
                </div>
              ) : (
                dayOptions.map((option) => {
                  const isActive = option.key === selectedDayKey;

                  return (
                    <Link
                      key={option.key}
                      href={`/courses/${examSlug}/day-wise?day=${option.key}`}
                      className={`flex h-11 items-center justify-center rounded-xl border text-sm font-semibold transition-all ${
                        isActive
                          ? "border-slate-900 bg-slate-900 text-white shadow-md shadow-slate-900/15"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-100"
                      }`}
                      aria-label={`Select ${option.label}`}
                    >
                      {option.date}
                    </Link>
                  );
                })
              )}
            </div>
          </aside>

          <section className="rounded-[24px] border border-slate-200 bg-white/80 p-5 shadow-[0_18px_35px_-25px_rgba(15,23,42,0.45)] md:p-7">
            <div className="mb-6 flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Day</p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">{selectedMeta.label}</h2>
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
              <div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Fresh Content</p>

                  {selectedDayRecord ? (
                    <div className="mt-4 space-y-3">
                      <div className="rounded-xl border border-slate-200 bg-white p-3">
                        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                          {selectedDayRecord.hcs ?? "HCS"}
                        </div>
                        <div className="mt-2 text-sm font-semibold text-slate-800">
                          {selectedDayRecord.course_name ?? "Course"}
                        </div>
                        <div className="mt-2 text-sm text-slate-700">
                          {selectedDayRecord.fresh_name ?? "No fresh content name"}
                        </div>
                        {selectedDayRecord.fresh_video_url ? (
                          <a
                            href={selectedDayRecord.fresh_video_url}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-3 inline-block text-xs font-medium text-slate-900 underline underline-offset-2"
                          >
                            Watch video
                          </a>
                        ) : null}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-600">
                      No fresh content for this day.
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-amber-50 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-700">Revision</p>

                  {selectedDayRecord ? (
                    <div className="mt-3 space-y-2 text-sm text-slate-700">
                      <div>{selectedDayRecord.revision_name ?? "No revision item"}</div>
                      {selectedDayRecord.revision_notes_url ? (
                        <a
                          href={selectedDayRecord.revision_notes_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-block text-xs font-medium text-amber-800 underline underline-offset-2"
                        >
                          Open notes
                        </a>
                      ) : null}
                    </div>
                  ) : (
                    <div className="mt-3 text-sm text-slate-600">No revision item.</div>
                  )}
                </div>

                <div className="rounded-2xl border border-slate-200 bg-emerald-50 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">Test</p>

                  {selectedDayRecord ? (
                    <div className="mt-3 space-y-3 text-sm text-slate-700">
                      {selectedDayRecord.mcqtest_name || selectedDayRecord.mcqtest_url ? (
                        <div>
                          <div className="font-medium text-slate-800">{selectedDayRecord.mcqtest_name ?? "MCQ Test"}</div>
                          {selectedDayRecord.mcqtest_url ? (
                            <a
                              href={selectedDayRecord.mcqtest_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs font-medium text-emerald-800 underline underline-offset-2"
                            >
                              Open MCQ test
                            </a>
                          ) : null}
                        </div>
                      ) : null}

                      {selectedDayRecord.pyqtest_name || selectedDayRecord.pyqtest_url ? (
                        <div>
                          <div className="font-medium text-slate-800">{selectedDayRecord.pyqtest_name ?? "PYQ Test"}</div>
                          {selectedDayRecord.pyqtest_url ? (
                            <a
                              href={selectedDayRecord.pyqtest_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs font-medium text-emerald-800 underline underline-offset-2"
                            >
                              Open PYQ test
                            </a>
                          ) : null}
                        </div>
                      ) : null}

                      {!selectedDayRecord.mcqtest_name && !selectedDayRecord.mcqtest_url && !selectedDayRecord.pyqtest_name && !selectedDayRecord.pyqtest_url ? (
                        <div>No test links available.</div>
                      ) : null}
                    </div>
                  ) : (
                    <div className="mt-3 text-sm text-slate-600">No test item.</div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
