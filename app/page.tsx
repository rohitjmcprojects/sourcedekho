import Link from "next/link";
import { sql } from "@/lib/db";

export default async function HomePage() {
  const exams = await sql`
    SELECT *
    FROM exams
    ORDER BY id ASC
  `;

  return (
    <main className="pl-[120px] pr-5 py-5">
      <div className="min-h-[calc(100vh-40px)] rounded-[32px] border bg-white shadow-sm p-8">

        {/* HEADER */}
        <div className="mb-6">
          
          <h1 className="text-4xl font-black tracking-tight">
            Courses <span className="text-sm font-medium text-gray-500 mb-2">Choose Your Exam</span>
          </h1>
        </div>

        {/* EXAM CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">

          {exams.map((exam: any) => (
            <Link
              key={exam.id}
              href={`/courses/${exam.name.toLowerCase()}`}
              className="
                relative
                border
                rounded-3xl
                p-5
                hover:shadow-md
                hover:-translate-y-1
                transition
                bg-white
                min-h-[180px]
                block
              "
            >
              {/* TOP */}
              <div className="flex items-center gap-3 mb-5">

                {/* TITLE */}
                <h2 className="text-xl font-bold">
                  {exam.name} 
                </h2>
              </div>

              {/* DESCRIPTION */}
              <p className="text-sm text-gray-500 leading-relaxed">
                {exam.description}
              </p>

              {/* ARROW */}
              <div
                className="
                  absolute
                  bottom-5
                  right-5
                  w-11
                  h-11
                  rounded-full
                  bg-black
                  text-white
                  flex
                  items-center
                  justify-center
                  text-xl
                "
              >
                →
              </div>
            </Link>
          ))}

        </div>
      </div>
    </main>
  );
}