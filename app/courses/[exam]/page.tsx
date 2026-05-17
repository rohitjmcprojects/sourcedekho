import Link from "next/link";
import { sql } from "@/lib/db";

export default async function ExamCoursesPage({
  params,
}: {
  params: Promise<{ exam: string }>;
}) {
  const { exam } = await params;

  // FETCH EXAM
  const exams = await sql`
    SELECT *
    FROM exams
    WHERE LOWER(name) = LOWER(${exam})
  `;

  const examData = exams[0];

  if (!examData) {
    return (
      <main className="pl-[120px] pr-5 py-5">
        <div className="min-h-[calc(100vh-40px)] rounded-[32px] border bg-white shadow-sm p-10">
          <h1 className="text-4xl font-bold">
            Exam not found
          </h1>
        </div>
      </main>
    );
  }

  // FETCH COURSES
  const courses = await sql`
    SELECT *
    FROM courses
    WHERE exam_id = ${examData.id}
    ORDER BY id ASC
  `;

  return (
    <main className="pl-[120px] pr-5 py-5">
      <div className="min-h-[calc(100vh-40px)] rounded-[32px] border bg-white shadow-sm p-8">

        {/* HEADER */}
        <div className="mb-10">

          <div className="flex items-center gap-4 mb-4">

            <div
              className="
                w-16
                h-16
                rounded-3xl
                bg-black
                text-white
                flex
                items-center
                justify-center
                text-2xl
                font-bold
              "
            >
              {examData.name[0]}
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">
                EXAM
              </p>

              <h1 className="text-5xl font-black tracking-tight">
                {examData.name}
              </h1>
            </div>

          </div>

          <p className="text-lg text-gray-500 max-w-3xl">
            {examData.description}
          </p>

        </div>

        {/* COURSES */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

          {courses.map((course: any) => (
            <Link
              key={course.id}
              href={`/courses/${examData.name.toLowerCase()}/${course.id}`}
              className="
                relative
                border
                rounded-[28px]
                p-6
                bg-white
                hover:shadow-lg
                hover:-translate-y-1
                transition
                min-h-[260px]
                block
              "
            >

              {/* TOP */}
              <div className="flex justify-between items-start mb-6">

                <div className="space-y-2">

                  <div
                    className="
                      inline-flex
                      px-4
                      py-2
                      rounded-2xl
                      bg-black
                      text-white
                      text-sm
                      font-semibold
                    "
                  >
                    {course.stage}
                  </div>

                  <div className="text-sm text-gray-500">
                    {examData.name}
                  </div>

                </div>

                <div className="text-3xl font-black">
                  ₹{course.price}
                </div>

              </div>

              {/* TITLE */}
              <h2 className="text-2xl font-bold mb-4 leading-tight">
                {course.title}
              </h2>

              {/* DESCRIPTION */}
              <p className="text-gray-500 text-sm leading-relaxed">
                {course.description}
              </p>

              {/* CTA */}
              <div
                className="
                  absolute
                  bottom-6
                  right-6
                  w-12
                  h-12
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