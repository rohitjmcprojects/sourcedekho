import Link from "next/link";
import { sql } from "@/lib/db";

type ExamRow = {
  id: number;
  name: string;
  description: string | null;
};

const fallbackExams: ExamRow[] = [
  {
    id: 1,
    name: "HCS 2026",
    description: "Complete preparation community for Haryana Civil Services 2026.",
  },
  {
    id: 2,
    name: "UPPCS 2026",
    description: "Daily classes, notes, MCQs, and PYQs for UPPCS aspirants.",
  },
  {
    id: 3,
    name: "RAS 2026",
    description: "Focused Rajasthan Administrative Services preparation.",
  },
  {
    id: 4,
    name: "UPSC 2027",
    description: "Premium UPSC preparation ecosystem for 2027 aspirants.",
  },
];

function toExamSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default async function DashboardPage() {
  let exams: ExamRow[] = fallbackExams;

  try {
    const rows = await sql<ExamRow[]>`
      SELECT id, name, description
      FROM exams
      ORDER BY name ASC
    `;

    if (rows.length > 0) {
      exams = rows;
    }
  } catch (error) {
    console.error("Failed to load exams:", error);
    exams = fallbackExams;
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f8f6f2_0%,_#f2efe9_32%,_#eef0f3_100%)] px-0 py-0 text-slate-900">
      <div className="w-full">
        {exams.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-8 text-center text-sm text-slate-600 backdrop-blur-sm">
            No exams are available yet.
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {exams.map((exam) => (
              <Link
                key={exam.id}
                href={`/courses/${toExamSlug(exam.name)}`}
                className="group relative flex h-[190px] w-full max-w-[390px] items-center justify-center gap-2 rounded-[26px] border border-white/80 bg-white/15 px-2 py-3 shadow-[0_18px_35px_-22px_rgba(15,23,42,0.5)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:drop-shadow-[0_20px_30px_rgba(15,23,42,0.12)]"
                aria-label={exam.name}
              >
                <div className="relative flex h-full items-center justify-center px-8 py-3">
                  <div className="absolute bottom-4 h-9 w-28 rounded-full bg-slate-900/10 blur-xl" />
                  <div className="absolute h-36 w-36 rounded-full blur-3xl" />
                  <img
                    src="/hcs.png"
                    alt={exam.name}
                    className="relative z-10 h-40 w-auto object-contain drop-shadow-[0_20px_30px_rgba(15,23,42,0.16)]"
                  />
                </div>

                <div className="flex h-full w-40 shrink-0 items-center overflow-hidden p-3">
                  <div className="mt-1 line-clamp-4 text-[15px] leading-5 text-slate-700">
                    {exam.description || "Preparation resources and course access."}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
