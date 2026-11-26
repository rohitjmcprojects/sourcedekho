import Link from "next/link";
import { sql } from "@/lib/db";
import {
  PlayCircle,
  FileText,
  ClipboardCheck,
  BookOpen,
  MessageCircleQuestion,
  FilePlus2,
  Send,
} from "lucide-react";

type ExamRow = {
  id: number;
  name: string;
  description: string | null;
  telegram_url: string | null;
  telegram_qr_url: string | null;
};

type SyllabusRow = {
  id: number;
  subject_id: number;
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
  created_at: string | null;
};

type SubjectTableRow = {
  id: number;
  stage: string | null;
  paper: string | null;
  subject: string | null;
};

type SubjectStrategyRow = {
  strategy_title: string | null;
  strategy_content: string;
  support_url: string | null;
  created_at: string | null;
  updated_at: string | null;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Total = rows with a resource name; available = rows with a non-empty URL.
function getResourceCount(
  rows: SyllabusRow[],
  nameKey: "video_name" | "notes_name" | "mcqtest_name" | "pyq_name",
  urlKey: "video_url" | "notes_url" | "mcqtest_url" | "pyq_url"
) {
  const total = rows.filter((row) => Boolean(row[nameKey]?.trim())).length;
  const available = rows.filter((row) => Boolean(row[urlKey]?.trim())).length;
  return { total, available };
}

function formatRelativeTime(dateValue: string) {
  const timestamp = new Date(dateValue).getTime();
  const elapsedSeconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));

  if (elapsedSeconds < 60) return "Just now";
  if (elapsedSeconds < 3600) {
    const minutes = Math.floor(elapsedSeconds / 60);
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  }
  if (elapsedSeconds < 86400) {
    const hours = Math.floor(elapsedSeconds / 3600);
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  }

  const days = Math.floor(elapsedSeconds / 86400);
  return `${days} ${days === 1 ? "day" : "days"} ago`;
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

  const isAvailable = Boolean(url?.trim());
  const availableColor =
    label === "Video"
      ? "text-emerald-700 hover:text-emerald-800"
      : label === "Notes"
        ? "text-blue-700 hover:text-blue-800"
        : label === "MCQ Test"
          ? "text-amber-700 hover:text-amber-800"
          : label === "PYQ"
            ? "text-purple-700 hover:text-purple-800"
            : "text-slate-700 hover:text-slate-800";

  return (
    <a
      href={isAvailable ? url ?? undefined : undefined}
      target={isAvailable ? "_blank" : undefined}
      rel={isAvailable ? "noreferrer" : undefined}
      aria-disabled={!isAvailable}
      title={!isAvailable ? "Shall be updated soon" : undefined}
      className={[
        "inline-flex items-center text-sm font-medium underline-offset-2 transition",
        isAvailable
          ? `${availableColor} hover:underline`
          : "text-slate-400 cursor-not-allowed no-underline",
      ].join(" ")}
    >
      {name}
    </a>
  );
}

export default async function SyllabusPaperPage({
  params,
  searchParams,
}: {
  params: Promise<{ exam: string; paper: string }>;
  searchParams?: Promise<{ subject?: string; medium?: string; uploadsPage?: string }>;
}) {
  const { exam, paper } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const examSlug = exam ?? "";
  const paperSlug = paper ?? "";
  const selectedMedium = resolvedSearchParams.medium === "Hindi" ? "Hindi" : "English";
  const uploadsPageSize = 5;
  const requestedUploadsPage = Math.max(1, Number.parseInt(resolvedSearchParams.uploadsPage ?? "1", 10) || 1);

  let selectedExam: ExamRow | null = null;
  let syllabusRows: SyllabusRow[] = [];
  let subjectNames: string[] = [];
  let selectedPaper = "";
  let selectedSubject = "";
  let selectedStrategy: SubjectStrategyRow | null = null;

  try {
    const exams = await sql<ExamRow[]>`
      SELECT id, name, description, telegram_url, telegram_qr_url
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
          sw.subject_id,
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
          sw.pyq_url,
          TO_JSONB(sw) ->> 'created_at' AS created_at
        FROM syllabus_wise AS sw
        INNER JOIN subjects AS s ON s.id = sw.subject_id
        LEFT JOIN courses AS c ON c.id = s.course_id
        WHERE COALESCE(NULLIF(TO_JSONB(s) ->> 'exam_id', ''), c.exam_id::text) = ${String(selectedExam.id)}
          AND sw.medium = ${selectedMedium}
        ORDER BY subject ASC, sw.topic ASC, paper ASC
      `;

      const matchedPaper = subjectRows.find(
        (row) => slugify(String(row.paper ?? "")) === paperSlug
      );
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

      const requestedSubject = (resolvedSearchParams?.subject ?? "").trim();
      const matchedSubject = subjectNames.find((subjectName) => {
        const current = String(subjectName).trim();
        return (
          current.toLowerCase() === requestedSubject.toLowerCase() ||
          slugify(current) === slugify(requestedSubject)
        );
      });
      selectedSubject = matchedSubject ?? subjectNames[0] ?? "";

      // Resolve the selected subject_id from syllabus_wise, then load its single strategy.
      const selectedSubjectRow = syllabusRows.find((row) => {
        const rowSubject = String(row.subject ?? "").trim();
        return (
          rowSubject.toLowerCase() === selectedSubject.toLowerCase() ||
          slugify(rowSubject) === slugify(selectedSubject)
        );
      });

      if (selectedSubjectRow?.subject_id) {
        const strategyRows = await sql<SubjectStrategyRow[]>`
          SELECT
            strategy_title,
            strategy_content,
            support_url,
            TO_JSONB(ss) ->> 'created_at' AS created_at,
            TO_JSONB(ss) ->> 'updated_at' AS updated_at
          FROM subject_strategies AS ss
          WHERE ss.subject_id = ${selectedSubjectRow.subject_id}
          LIMIT 1
        `;
        selectedStrategy = strategyRows[0] ?? null;
      }
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
  const totalTopics = themeGroups.reduce((total, [, rows]) => {
    const uniqueTopics = new Set(
      rows.map((row) => String(row.topic ?? "General").trim() || "General")
    );
    return total + uniqueTopics.size;
  }, 0);

  const videoCount = getResourceCount(subjectContentRows, "video_name", "video_url");
  const notesCount = getResourceCount(subjectContentRows, "notes_name", "notes_url");
  const mcqCount = getResourceCount(subjectContentRows, "mcqtest_name", "mcqtest_url");
  const pyqCount = getResourceCount(subjectContentRows, "pyq_name", "pyq_url");

  const latestUploadEntries = syllabusRows
    .filter((row) => row.created_at && !Number.isNaN(new Date(row.created_at).getTime()))
    .sort(
      (a, b) =>
        new Date(b.created_at as string).getTime() -
        new Date(a.created_at as string).getTime()
    );
  const uploadsTotalPages = Math.max(1, Math.ceil(latestUploadEntries.length / uploadsPageSize));
  const currentUploadsPage = Math.min(requestedUploadsPage, uploadsTotalPages);
  const paginatedUploadEntries = latestUploadEntries.slice(
    (currentUploadsPage - 1) * uploadsPageSize,
    currentUploadsPage * uploadsPageSize
  );
  const uploadsPageHref = (pageNumber: number) =>
    `/courses/${examSlug}/syllabus-wise/${paperSlug}?subject=${encodeURIComponent(selectedSubject)}&medium=${selectedMedium}&uploadsPage=${pageNumber}`;

  const queryFormUrl = new URL("https://forms.gle/sDUN5mVf21nvoeHFA");
  const contributionFormUrl = "PASTE_CONTRIBUTION_GOOGLE_FORM_URL_HERE";

  queryFormUrl.searchParams.set("usp", "pp_url");
  queryFormUrl.searchParams.set("entry.179034276", selectedExam?.name ?? "");
  queryFormUrl.searchParams.set("entry.1620531068", selectedPaper);
  queryFormUrl.searchParams.set("entry.1497946113", selectedSubject);
  queryFormUrl.searchParams.set("entry.2012252946", selectedMedium);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f8f6f2_0%,_#f2efe9_32%,_#eef0f3_100%)] px-0 py-0 text-slate-900">
      <div className="w-full px-4 py-6 md:px-8">
        {/* TOP NAVIGATION */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <nav aria-label="Breadcrumb" className="min-w-0">
            <ol className="flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em]">
              <li>
                <Link href="/" className="text-slate-500 underline-offset-4 transition hover:text-teal-700 hover:underline">
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="text-slate-400">/</li>
              <li>
                <Link href={`/courses/${examSlug}`} className="text-slate-600 underline-offset-4 transition hover:text-teal-700 hover:underline">
                  {selectedExam?.name ?? "Exam"}
                </Link>
              </li>
              <li aria-hidden="true" className="text-slate-400">/</li>
              <li>
                <Link href={`/courses/${examSlug}/syllabus-wise/${paperSlug}?medium=${selectedMedium}`} className="text-slate-600 underline-offset-4 transition hover:text-teal-700 hover:underline">
                  {selectedPaper || "Paper"}
                </Link>
              </li>
              {selectedSubject ? (
                <>
                  <li aria-hidden="true" className="text-slate-400">/</li>
                  <li aria-current="page" className="text-slate-500">{selectedSubject}</li>
                </>
              ) : null}
            </ol>
          </nav>

          <div className="flex flex-wrap items-center justify-end gap-3">
            {/* MEDIUM SWITCH */}
            <div className="inline-flex h-10 items-center gap-3 rounded-full border border-slate-200 bg-white px-3 shadow-sm">
              <span className={`whitespace-nowrap text-[11px] font-semibold ${selectedMedium === "Hindi" ? "text-teal-600" : "text-slate-400"}`}>
                हिंदी मीडियम
              </span>
              <Link
                href={`/courses/${examSlug}/syllabus-wise/${paperSlug}?subject=${encodeURIComponent(selectedSubject)}&medium=${selectedMedium === "Hindi" ? "English" : "Hindi"}`}
                role="switch"
                aria-checked={selectedMedium === "Hindi"}
                aria-label="Switch between Hindi and English medium"
                className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-200 ${selectedMedium === "Hindi" ? "bg-teal-600" : "bg-slate-300"}`}
              >
                <span className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${selectedMedium === "Hindi" ? "translate-x-1" : "translate-x-6"}`} />
              </Link>
              <span className={`whitespace-nowrap text-[11px] font-semibold ${selectedMedium === "English" ? "text-teal-600" : "text-slate-400"}`}>
                English Medium
              </span>
            </div>

            <a href={queryFormUrl.toString()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2">
              <MessageCircleQuestion className="h-4 w-4" />
              Doubt?
            </a>

            <a href={contributionFormUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-xl border border-teal-200 bg-teal-50 px-3 py-2.5 text-xs font-semibold text-teal-800 shadow-sm transition hover:bg-teal-100 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2">
              <FilePlus2 className="h-4 w-4" />
              Publish Your Content
            </a>

            {(selectedExam?.telegram_url || selectedExam?.telegram_qr_url) ? (
              <details className="relative">
                <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 rounded-xl bg-sky-600 px-3 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2">
                  <Send className="h-4 w-4" />
                  Join Telegram
                </summary>
                <div className="absolute right-0 top-[calc(100%+12px)] z-[100] w-[min(300px,calc(100vw-2rem))] rounded-[24px] border border-slate-200/80 bg-white/95 p-4 shadow-[0_22px_45px_-18px_rgba(15,23,42,0.45)] backdrop-blur-xl">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <Send className="h-4 w-4 text-sky-600" />
                    Join Telegram
                  </div>
                  {selectedExam?.telegram_qr_url ? (
                    <a href={selectedExam.telegram_qr_url} target="_blank" rel="noopener noreferrer" aria-label="Open Telegram QR code image" className="mb-3 block rounded-xl bg-slate-50 p-2">
                      <img src={selectedExam.telegram_qr_url} alt="Telegram QR code" className="mx-auto aspect-square max-h-64 w-full rounded-lg object-contain" />
                    </a>
                  ) : null}
                  {selectedExam?.telegram_url ? (
                    <a href={selectedExam.telegram_url} target="_blank" rel="noopener noreferrer" className="block break-all rounded-xl border border-sky-200 bg-sky-50 px-3 py-2.5 text-center text-xs font-semibold text-sky-700 underline underline-offset-2 transition hover:bg-sky-100">
                      {selectedExam.telegram_url}
                    </a>
                  ) : null}
                </div>
              </details>
            ) : null}
          </div>
        </div>

        {/* MAIN LAYOUT */}
        {subjectNames.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-10 text-center text-sm text-slate-600 backdrop-blur-sm">
            No syllabus content is available for this paper yet.
          </div>
        ) : (
          <>
        {/* COLLAPSIBLE PANELS - OUTSIDE THE TWO-COLUMN LAYOUT */}
        <div className="mb-5 flex flex-nowrap items-start gap-3">
          {/* STATISTICS */}
          <details className="min-w-0 flex-[2] overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 bg-slate-100 px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-700">
              <span>Content Progress</span>
              <span className="text-slate-500">Show / hide</span>
            </summary>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-200 px-4 py-3 text-sm">
              <span className="font-semibold text-slate-800">{totalThemes} Themes</span>
              <span className="font-semibold text-slate-800">{totalTopics} Topics</span>
              <span className="font-semibold text-emerald-700">• Videos ({videoCount.total > 0 ? Math.round((videoCount.available / videoCount.total) * 100) : 0}%)</span>
              <span className="font-semibold text-blue-700">• Notes ({notesCount.total > 0 ? Math.round((notesCount.available / notesCount.total) * 100) : 0}%)</span>
              <span className="font-semibold text-amber-700">• MCQ Tests ({mcqCount.total > 0 ? Math.round((mcqCount.available / mcqCount.total) * 100) : 0}%)</span>
              <span className="font-semibold text-purple-700">• PYQ Tests ({pyqCount.total > 0 ? Math.round((pyqCount.available / pyqCount.total) * 100) : 0}%)</span>
              <div className="basis-full border-t border-slate-200 pt-2 text-xs text-slate-600">
                <p className="mb-2 font-semibold text-slate-800">Latest Uploads</p>
                {latestUploadEntries.length > 0 ? (
                  <>
                  <ol className="space-y-1.5">
                    {paginatedUploadEntries.map((row) => (
                      <li key={row.id} className="flex flex-wrap items-baseline gap-x-2">
                        <span className="shrink-0 font-semibold text-slate-700">
                          {formatRelativeTime(row.created_at as string)}
                        </span>
                        <span className="text-slate-500">
                          {[row.subject, row.theme, row.topic].filter(Boolean).join(" · ") || "Content entry"}
                        </span>
                      </li>
                    ))}
                  </ol>
                  <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-200 pt-2">
                    <span className="text-[11px] text-slate-500">Page {currentUploadsPage} of {uploadsTotalPages} · {latestUploadEntries.length} uploads</span>
                    <div className="flex items-center gap-2">
                      {currentUploadsPage > 1 ? (
                        <Link href={uploadsPageHref(currentUploadsPage - 1)} className="rounded-md border border-slate-300 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100">Previous</Link>
                      ) : (
                        <span className="rounded-md border border-slate-200 px-2.5 py-1 text-[11px] text-slate-300">Previous</span>
                      )}
                      {currentUploadsPage < uploadsTotalPages ? (
                        <Link href={uploadsPageHref(currentUploadsPage + 1)} className="rounded-md border border-slate-300 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100">Next</Link>
                      ) : (
                        <span className="rounded-md border border-slate-200 px-2.5 py-1 text-[11px] text-slate-300">Next</span>
                      )}
                    </div>
                  </div>
                  </>
                ) : (
                  <p className="text-slate-500">No upload information available for this paper.</p>
                )}
              </div>
            </div>
          </details>

          {/* STUDY STRATEGY */}
          <details className="min-w-0 flex-[3] overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 bg-slate-100 px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-700">
              <span>Strategy</span>
              <span className="text-slate-500">Show / hide</span>
            </summary>
            <div className="border-t border-slate-200 px-4 py-3 text-sm text-slate-700">
              {selectedStrategy ? (
                <div className="space-y-3">
                  {selectedStrategy.strategy_title ? (
                    <h3 className="font-semibold text-slate-900">{selectedStrategy.strategy_title}</h3>
                  ) : null}
                  <div className="whitespace-pre-wrap leading-6">{selectedStrategy.strategy_content}</div>
                  {selectedStrategy.support_url ? (
                    <a
                      href={selectedStrategy.support_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-xs font-semibold text-teal-800 transition hover:bg-teal-100"
                    >
                      View supporting charts / material ↗
                    </a>
                  ) : null}
                </div>
              ) : (
                <p className="text-slate-500">
                  No strategy has been added for {selectedSubject || "this subject"} yet.
                </p>
              )}
            </div>
          </details>
        </div>

          <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
            {/* LEFT SIDEBAR */}
            <aside className="h-fit rounded-[24px] border border-slate-400 p-3 shadow-inner shadow-slate-200/60">
              {/* SUBJECT LIST */}
              <div className="mb-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Subjects
                </p>
              </div>
              <div className="space-y-2">
                {subjectNames.map((subjectName) => {
                  const isSelected = subjectName === selectedSubject;
                  const hasData = subjectDataMap.get(subjectName) ?? false;
                  return (
                    <Link
                      key={subjectName}
                      href={`/courses/${examSlug}/syllabus-wise/${paperSlug}?subject=${encodeURIComponent(subjectName)}&medium=${selectedMedium}`}
                      className={[
                        "flex items-center justify-between gap-2 rounded-xl border px-3 py-2 text-sm font-medium text-slate-900 transition",
                        isSelected
                          ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                          : hasData
                            ? "border-emerald-200 text-slate-900 hover:border-emerald-300 hover:bg-emerald-100"
                            : "border-red-200 bg-red-50 text-slate-900 hover:border-red-300 hover:bg-red-100",
                      ].join(" ")}
                    >
                      <span>{subjectName}</span>
                      {hasData ? (
                        <span
                          className={[
                            "inline-flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 shadow-sm",
                            isSelected
                              ? "border-white bg-emerald-400 shadow-emerald-200/80"
                              : "border-emerald-100 bg-emerald-500 shadow-emerald-200/80",
                          ].join(" ")}
                          title="Data available"
                          aria-label="Data available"
                        />
                      ) : (
                        <span
                          className={[
                            "inline-flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 shadow-sm",
                            isSelected
                              ? "border-white bg-red-400 shadow-red-200/80"
                              : "border-red-100 bg-red-500 shadow-red-200/80",
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

            {/* RIGHT SYLLABUS CONTENT */}
            <section className="rounded-[24px] border border-slate-200">
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

                    const themeTopicCount = topicGroups.length;

                    return (
                      <details key={themeName} className="group/theme rounded-3xl border border-slate-400 p-2">
                        {/* THEME HEADING */}
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
                          <h3 className="text-lg font-bold text-slate-900">{themeName}</h3>
                          <div className="flex flex-wrap items-center justify-end gap-2">
                            <span className="rounded-full bg-slate-200 px-2 py-1 text-xs font-semibold text-slate-700">
                              Topics: {themeTopicCount}
                            </span>
                            <span className="mr-2 text-slate-500 transition-transform duration-200 group-open/theme:rotate-180">▼</span>
                          </div>
                        </summary>

                        {/* TOPICS */}
                        <div className="space-y-1 pt-2">
                          {topicGroups.map(([topicName, topicRows]) => {
                            const videoLinks = topicRows
                              .map((row) => ({ id: row.id, url: row.video_url, name: row.video_name }))
                              .filter((item) => item.name);
                            const noteLinks = topicRows
                              .map((row) => ({ id: row.id, url: row.notes_url, name: row.notes_name }))
                              .filter((item) => item.name);
                            const mcqLinks = topicRows
                              .map((row) => ({ id: row.id, url: row.mcqtest_url, name: row.mcqtest_name }))
                              .filter((item) => item.name);
                            const pyqLinks = topicRows
                              .map((row) => ({ id: row.id, url: row.pyq_url, name: row.pyq_name }))
                              .filter((item) => item.name);

                            const topicVideoCount = getResourceCount(topicRows, "video_name", "video_url");
                            const topicNotesCount = getResourceCount(topicRows, "notes_name", "notes_url");
                            const topicMcqCount = getResourceCount(topicRows, "mcqtest_name", "mcqtest_url");
                            const topicPyqCount = getResourceCount(topicRows, "pyq_name", "pyq_url");

                            return (
                              <details key={`${themeName}-${topicName}`} className="group/topic rounded-xl border border-slate-200 p-3">
                                {/* TOPIC HEADING */}
                                <summary className="mb-3 flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-slate-700">
                                  <span>{topicName}</span>
                                  <div className="flex flex-wrap items-center justify-end gap-2">
                                    <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                                      Videos: {topicVideoCount.available}/{topicVideoCount.total}
                                    </span>
                                    <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">
                                      Notes: {topicNotesCount.available}/{topicNotesCount.total}
                                    </span>
                                    <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">
                                      MCQ_Test: {topicMcqCount.available}/{topicMcqCount.total}
                                    </span>
                                    <span className="rounded-full bg-purple-100 px-2 py-1 text-xs font-semibold text-purple-700">
                                      PYQ_Test: {topicPyqCount.available}/{topicPyqCount.total}
                                    </span>
                                    <span className="text-slate-500 transition-transform duration-200 group-open/topic:rotate-180">▼</span>
                                  </div>
                                </summary>

                                {/* RESOURCE LAYOUT */}
                                <div className="flex flex-col gap-0 overflow-hidden rounded-xl xl:flex-row xl:divide-x xl:divide-slate-500">
                                  {/* VIDEOS */}
                                  <div className="flex-1 p-3">
                                    <ul className="space-y-1 pl-4 text-sm text-slate-700">
                                      {videoLinks.length === 0 ? (
                                        <li className="text-slate-400">No videos</li>
                                      ) : (
                                        videoLinks.map((link) => (
                                          <li key={link.id} className="flex list-none items-start gap-2" title={!link.url ? "Shall be updated soon" : undefined}>
                                            <PlayCircle className={`mt-0.5 h-4 w-4 shrink-0 ${link.url ? "text-emerald-600" : "text-slate-400"}`} />
                                            <ResourceLink label="Video" url={link.url} name={link.name} />
                                          </li>
                                        ))
                                      )}
                                    </ul>
                                  </div>

                                  {/* NOTES */}
                                  <div className="flex-1 p-3">
                                    <ul className="space-y-1 pl-4 text-sm text-slate-700">
                                      {noteLinks.length === 0 ? (
                                        <li className="text-slate-400">No notes</li>
                                      ) : (
                                        noteLinks.map((link) => (
                                          <li key={link.id} className="flex list-none items-start gap-2" title={!link.url ? "Shall be updated soon" : undefined}>
                                            <FileText className={`mt-0.5 h-4 w-4 shrink-0 ${link.url ? "text-blue-600" : "text-slate-400"}`} />
                                            <ResourceLink label="Notes" url={link.url} name={link.name} />
                                          </li>
                                        ))
                                      )}
                                    </ul>
                                  </div>

                                  {/* MCQ TEST */}
                                  <div className="flex-1 p-3">
                                    <ul className="space-y-1 pl-4 text-sm text-slate-700">
                                      {mcqLinks.length === 0 ? (
                                        <li className="text-slate-400">No MCQ test</li>
                                      ) : (
                                        mcqLinks.map((link) => (
                                          <li key={link.id} className="flex list-none items-start gap-2">
                                            <ClipboardCheck className={`mt-0.5 h-4 w-4 shrink-0 ${link.url ? "text-amber-600" : "text-slate-400"}`} />
                                            <ResourceLink label="MCQ Test" url={link.url} name={link.name} />
                                          </li>
                                        ))
                                      )}
                                    </ul>
                                  </div>

                                  {/* PYQ TEST */}
                                  <div className="flex-1 p-3">
                                    <ul className="space-y-1 pl-4 text-sm text-slate-700">
                                      {pyqLinks.length === 0 ? (
                                        <li className="text-slate-400">No PYQ</li>
                                      ) : (
                                        pyqLinks.map((link) => (
                                          <li key={link.id} className="flex list-none items-start gap-2" title={!link.url ? "Shall be updated soon" : undefined}>
                                            <BookOpen className={`mt-0.5 h-4 w-4 shrink-0 ${link.url ? "text-purple-600" : "text-slate-400"}`} />
                                            <ResourceLink label="PYQ" url={link.url} name={link.name} />
                                          </li>
                                        ))
                                      )}
                                    </ul>
                                  </div>
                                </div>
                              </details>
                            );
                          })}
                        </div>
                      </details>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
          </>
        )}
      </div>
    </main>
  );
}
