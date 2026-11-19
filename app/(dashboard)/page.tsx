import Link from "next/link";
import { sql } from "@/lib/db";

type ExamRow = { id: number; name: string; description: string | null };
type VirtualLibraryRow = {
  id: number;
  title: string;
  description: string | null;
  image_url: string | null;
  slug: string;
  redirect_url: string | null;
  display_order: number;
};

function toExamSlug(name: string) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export default async function DashboardPage() {
  let exams: ExamRow[] = [];
  let virtualLibraries: VirtualLibraryRow[] = [];

  try {
    const [examRows, libraryRows] = await Promise.all([
      sql<ExamRow[]>`
        SELECT id, name, description
        FROM exams
        ORDER BY name ASC
      `,
      sql<VirtualLibraryRow[]>`
        SELECT id, title, description, image_url, slug, redirect_url, display_order
        FROM "VirtualLibrary"
        WHERE is_active = TRUE
        ORDER BY display_order ASC, id ASC
      `,
    ]);
    exams = examRows;
    virtualLibraries = libraryRows;
  } catch (error) {
    console.error("Failed to load dashboard cards:", error);
  }

  const hasCards = exams.length > 0 || virtualLibraries.length > 0;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f8f6f2_0%,_#f2efe9_32%,_#eef0f3_100%)] px-0 py-0 text-slate-900">
      <div className="w-full">
        {!hasCards ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-8 text-center text-sm text-slate-600 backdrop-blur-sm">
            No courses or library resources are available yet.
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {exams.map((exam) => (
              <Link
                key={`exam-${exam.id}`}
                href={`/courses/${toExamSlug(exam.name)}`}
                className="group relative flex h-[190px] w-full max-w-[390px] items-center justify-center gap-2 rounded-[26px] border border-white/80 bg-white/15 px-2 py-3 shadow-[0_18px_35px_-22px_rgba(15,23,42,0.5)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:drop-shadow-[0_20px_30px_rgba(15,23,42,0.12)]"
                aria-label={exam.name}
              >
                <div className="relative flex h-full items-center justify-center px-8 py-3">
                  <div className="absolute bottom-4 h-9 w-28 rounded-full bg-slate-900/10 blur-xl" />
                  <div className="absolute h-36 w-36 rounded-full blur-3xl" />
                  <img src="/hcs.png" alt={exam.name} className="relative z-10 h-40 w-auto object-contain drop-shadow-[0_20px_30px_rgba(15,23,42,0.16)]" />
                </div>
                <div className="flex h-full w-40 shrink-0 items-center overflow-hidden p-3">
                  <div className="mt-1 line-clamp-4 text-[15px] leading-5 text-slate-700">
                    {exam.description || "Preparation resources and course access."}
                  </div>
                </div>
              </Link>
            ))}

            {virtualLibraries.map((library) => (
              <Link
                key={`virtual-library-${library.id}`}
                href={`/virtual-library/${library.slug}`}
                aria-label={`Open ${library.title}`}
                className="group relative flex h-[250px] w-full max-w-[390px] items-center overflow-hidden rounded-[26px] border border-white/80 bg-white/55 px-4 py-3 shadow-[0_18px_35px_-22px_rgba(15,23,42,0.35)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:bg-white/75 hover:shadow-[0_22px_38px_-20px_rgba(15,23,42,0.3)] focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
              >
                <div className="pointer-events-none absolute -right-10 -top-14 h-44 w-44 rounded-full bg-emerald-100/70 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-16 left-8 h-32 w-44 rounded-full bg-teal-200/30 blur-3xl" />
                <div className="pointer-events-none absolute inset-0 rounded-[26px] bg-gradient-to-br from-white/45 via-transparent to-emerald-900/[0.04]" />

                <div className="relative z-10 flex h-full w-[46%] shrink-0 items-center justify-center pr-1">
                  <img
                    src={library.image_url || "/vlib.png"}
                    alt="A shared study space for aspirants"
                    className="max-h-[205px] max-w-full object-contain drop-shadow-[0_10px_14px_rgba(15,23,42,0.12)] transition-transform duration-300 group-hover:scale-[1.04]"
                  />
                </div>

                <div className="relative z-10 flex min-w-0 flex-1 flex-col justify-center pl-2">
                  <span className="mb-2 inline-flex w-fit items-center gap-1.5 rounded-full border border-emerald-200/80 bg-white/85 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.15em] text-emerald-700 shadow-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Study together
                  </span>
                  <h2 className="text-[19px] font-extrabold leading-tight tracking-tight text-slate-800">
                    {library.title}
                  </h2>
                  <p className="mt-2 line-clamp-3 text-xs leading-[1.25rem] text-slate-600">
                    {library.description || "Join fellow aspirants, study at your own pace, and stay motivated together. Your study companions are here."}
                  </p>
                  <span className="mt-3 inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-white/85 px-3.5 py-2 text-[11px] font-bold text-emerald-800 transition group-hover:border-emerald-700 group-hover:bg-emerald-700 group-hover:text-white">
                    Enter Reading Hall <span aria-hidden="true">→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
