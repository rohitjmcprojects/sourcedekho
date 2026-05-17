import Link from "next/link";
import { sql } from "@/lib/db";

export default async function LectureDashboardPage({
  params,
  searchParams,
}: {
  params: Promise<{
    exam: string;
    id: string;
  }>;
  searchParams: Promise<{
    subject?: string;
  }>;
}) {
  const { id } = await params;
  const { subject } = await searchParams;

  // FETCH COURSE
  const courses = await sql`
    SELECT
      courses.*,
      exams.name AS exam_name
    FROM courses
    JOIN exams
      ON exams.id = courses.exam_id
    WHERE courses.id = ${id}
  `;

  const course = courses[0];

  if (!course) {
    return (
      <main className="pl-[120px] pr-5 py-5">
        <div className="min-h-[calc(100vh-40px)] rounded-[32px] border bg-white shadow-sm p-10">
          <h1 className="text-4xl font-bold">
            Dashboard not found
          </h1>
        </div>
      </main>
    );
  }

  // FETCH SUBJECTS
  const subjects = await sql`
    SELECT DISTINCT subject_name
    FROM lectures
    WHERE course_id = ${course.id}
    ORDER BY subject_name ASC
  `;

  const activeSubject =
    subject || subjects[0]?.subject_name;

  // FETCH LECTURES
  const lectures = await sql`
    SELECT *
    FROM lectures
    WHERE course_id = ${course.id}
    AND subject_name = ${activeSubject}
    ORDER BY id ASC
  `;

  return (
    <main className="pl-[120px] pr-5 py-5">

      <div className="min-h-[calc(100vh-40px)] rounded-[32px] border bg-white shadow-sm overflow-hidden">

        {/* HEADER */}
        <div className="p-8 border-b">

          <div className="flex items-center gap-3 mb-4">

            <div
              className="
                px-4
                py-2
                rounded-2xl
                bg-black
                text-white
                text-sm
                font-semibold
              "
            >
              {course.exam_name}
            </div>

            <div
              className="
                px-4
                py-2
                rounded-2xl
                bg-gray-100
                text-sm
                font-semibold
              "
            >
              {course.stage}
            </div>

          </div>

          <p className="text-sm font-medium text-gray-500 mb-3">
            LECTURE DASHBOARD
          </p>

          <h1 className="text-5xl font-black tracking-tight">
            {course.title}
          </h1>

        </div>

        {/* BODY */}
        <div className="p-8">

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

            {/* SUBJECTS */}
            <div className="space-y-4">

              {subjects.map((sub: any) => {
                const isActive =
                  sub.subject_name === activeSubject;

                return (
                  <Link
                    key={sub.subject_name}
                    href={`?subject=${sub.subject_name}`}
                    className={`
                      block
                      border
                      rounded-[28px]
                      p-5
                      transition
                      ${
                        isActive
                          ? "bg-black text-white"
                          : "hover:bg-gray-50"
                      }
                    `}
                  >

                    <h3 className="text-xl font-bold">
                      {sub.subject_name}
                    </h3>

                  </Link>
                );
              })}

            </div>

            {/* LECTURES */}
            <div className="lg:col-span-3">

              {/* TOPBAR */}
              <div className="mb-6">

                <h2 className="text-3xl font-bold">
                  {activeSubject}
                </h2>

              </div>

              {/* LECTURES */}
              <div className="space-y-4">

                {lectures.map((lecture: any, index: number) => (
                  <div
                    key={lecture.id}
                    className="
                      border
                      rounded-[28px]
                      p-6
                      flex
                      items-center
                      justify-between
                      hover:shadow-md
                      transition
                    "
                  >

                    <div className="flex items-center gap-5">

                      {/* NUMBER */}
                      <div
                        className="
                          w-14
                          h-14
                          rounded-2xl
                          bg-black
                          text-white
                          flex
                          items-center
                          justify-center
                          font-bold
                        "
                      >
                        {(index + 1)
                          .toString()
                          .padStart(2, "0")}
                      </div>

                      {/* INFO */}
                      <div>

                        <h3 className="text-xl font-bold">
                          {lecture.lecture_title}
                        </h3>

                        <p className="text-gray-500 mt-2">
                          {lecture.duration}
                          {lecture.notes_available &&
                            " • Notes Included"}
                        </p>

                      </div>

                    </div>

                    {/* ACTION */}
                    <button
                      className="
                        w-12
                        h-12
                        rounded-full
                        bg-black
                        text-white
                        text-xl
                      "
                    >
                      →
                    </button>

                  </div>
                ))}

              </div>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}