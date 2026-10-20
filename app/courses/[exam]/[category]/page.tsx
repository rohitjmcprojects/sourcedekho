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

export default async function ExamCategoryPage({
  params,
}: {
  params: Promise<{ exam: string; category: string }>;
}) {
  const { exam, category } = await params;
  const examSlug = exam ?? "";
  const categorySlug = category ?? "";

  let selectedExam: ExamRow | null = null;
  let selectedCategory = "";
  let courseRows: CourseRow[] = [];

  try {
    const exams = await sql<ExamRow[]>`
      SELECT id, name, description
      FROM exams
      ORDER BY name ASC
    `;

    selectedExam = exams.find((item) => slugify(item.name) === examSlug) ?? null;

    if (selectedExam) {
      const categoryRows = await sql<{ category: string }[]>`
        SELECT DISTINCT category
        FROM courses
        WHERE exam_id = ${selectedExam.id}
      `;

      const matchedCategory = categoryRows.find((row) => slugify(row.category) === categorySlug);
      selectedCategory = matchedCategory?.category ?? "";

      if (selectedCategory) {
        courseRows = await sql<CourseRow[]>`
          SELECT id, exam_id, category, title, description, price
          FROM courses
          WHERE exam_id = ${selectedExam.id}
            AND category = ${selectedCategory}
          ORDER BY title ASC
        `;
      }
    }
  } catch (error) {
    console.error("Failed to load category course rows:", error);
  }

  const isDayWise = selectedCategory.toLowerCase().includes("day");
  const isSyllabusWise = selectedCategory.toLowerCase().includes("syllabus");

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
          <h1 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">
            {selectedCategory || "Course category"}
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            {isDayWise ? "Daily learning flow" : isSyllabusWise ? "Syllabus-based progression" : "Course offerings"}
          </p>
        </div>

        {courseRows.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-10 text-center text-sm text-slate-600 backdrop-blur-sm">
            No courses are available in this category yet.
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {courseRows.map((course) => (
              <Link
                key={course.id}
                href="#"
                className="group relative flex h-[190px] w-full max-w-[390px] items-center justify-center gap-2 rounded-[26px] border border-white/80 bg-white/15 px-2 py-3 shadow-[0_18px_35px_-22px_rgba(15,23,42,0.5)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:drop-shadow-[0_20px_30px_rgba(15,23,42,0.12)]"
                aria-label={course.title}
              >
                <div className="relative flex h-full items-center justify-center px-8 py-3">
                  <div className="absolute bottom-4 h-9 w-28 rounded-full bg-slate-900/10 blur-xl" />
                  <div className="absolute h-36 w-36 rounded-full blur-3xl" />
                  <img
                    src="/hcs.png"
                    alt={course.title}
                    className="relative z-10 h-40 w-auto object-contain drop-shadow-[0_20px_30px_rgba(15,23,42,0.16)]"
                  />
                </div>

                <div className="flex h-full w-40 shrink-0 items-center overflow-hidden p-3">
                  <div className="mt-1 text-left">
                    <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                      {course.category}
                    </div>
                    <div className="line-clamp-3 text-[15px] leading-5 text-slate-700">
                      {course.description || "Preparation resources and course access."}
                    </div>
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
