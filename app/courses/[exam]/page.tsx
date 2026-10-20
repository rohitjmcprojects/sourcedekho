import Link from "next/link";
import { sql } from "@/lib/db";

type ExamRow = {
  id: number;
  name: string;
  description: string | null;
};

type CategoryRow = {
  category: string;
  title: string | null;
  description: string | null;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default async function ExamPage({
  params,
}: {
  params: Promise<{ exam: string }>;
}) {
  const { exam } = await params;
  const slug = exam ?? "";

  let selectedExam: ExamRow | null = null;
  let categories: CategoryRow[] = [];

  try {
    const exams = await sql<ExamRow[]>`
      SELECT id, name, description
      FROM exams
      ORDER BY name ASC
    `;

    selectedExam = exams.find((item) => slugify(item.name) === slug) ?? null;

    if (selectedExam) {
      const rows = await sql<CategoryRow[]>`
        SELECT DISTINCT category, title, description
        FROM courses
        WHERE exam_id = ${selectedExam.id}
        ORDER BY category ASC
      `;

      categories = rows.filter((row) => row.category).map((row) => ({
        category: row.category,
        title: row.title ?? row.category,
        description: row.description ?? "Preparation resources and course access.",
      }));
    }
  } catch (error) {
    console.error("Failed to load exam categories:", error);
  }

  const pageTitle = selectedExam?.name ?? "Exam";
  const pageDescription = selectedExam?.description ?? "Preparation resources and course access.";

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f8f6f2_0%,_#f2efe9_32%,_#eef0f3_100%)] px-0 py-0 text-slate-900">
      <div className="w-full px-4 py-6 md:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link href="/" className="text-sm font-medium text-slate-700 hover:text-slate-900">
            ← Back to exams
          </Link>
        </div>

        <div className="mb-8 text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            {pageTitle}
          </p>
          <p className="mt-2 text-sm text-slate-600">{pageDescription}</p>
        </div>

        {categories.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-10 text-center text-sm text-slate-600 backdrop-blur-sm">
            No course categories are available for this exam yet.
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {categories.map((item) => {
              const category = item.category;
              const categorySlug = slugify(category);
              const isDayWise = category.toLowerCase().includes("day");
              const isSyllabusWise = category.toLowerCase().includes("syllabus");

              return (
                <Link
                  key={category}
                  href={
                    isDayWise
                      ? `/courses/${slug}/day-wise`
                      : isSyllabusWise
                        ? `/courses/${slug}/syllabus-wise`
                        : `/courses/${slug}/${categorySlug}`
                  }
                  className="group relative flex h-[190px] w-full max-w-[390px] items-center justify-center gap-2 rounded-[26px] border border-white/80 bg-white/15 px-2 py-3 shadow-[0_18px_35px_-22px_rgba(15,23,42,0.5)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:drop-shadow-[0_20px_30px_rgba(15,23,42,0.12)]"
                  aria-label={category}
                >
                  <div className="relative flex h-full items-center justify-center px-8 py-3">
                    <div className="absolute bottom-4 h-9 w-28 rounded-full bg-slate-900/10 blur-xl" />
                    <div className="absolute h-36 w-36 rounded-full blur-3xl" />
                    <img
                      src="/hcs.png"
                      alt={category}
                      className="relative z-10 h-40 w-auto object-contain drop-shadow-[0_20px_30px_rgba(15,23,42,0.16)]"
                    />
                  </div>

                  <div className="flex h-full w-40 shrink-0 items-center overflow-hidden p-3">
                    <div className="mt-1 text-left">
                      <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                        {category}
                      </div>
                      <div className="line-clamp-2 text-[15px] font-medium leading-5 text-slate-700">
                        {item.title ?? category}
                      </div>
                      <div className="mt-2 line-clamp-3 text-[11px] leading-4 text-slate-500">
                        {item.description}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
