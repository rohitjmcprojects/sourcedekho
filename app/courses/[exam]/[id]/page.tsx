import { sql } from "@/lib/db";

import CourseEnrollButton from "@/components/CourseEnrollButton";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{
    exam: string;
    id: string;
  }>;
}) {
  const { exam, id } = await params;

  // FETCH COURSE
  const courses = await sql`
    SELECT
      courses.*,
      exams.name AS exam_name,
      exams.description AS exam_description
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
            Course not found
          </h1>
        </div>
      </main>
    );
  }

  return (
    <main className="pl-[120px] pr-5 py-5">

      <div className="min-h-[calc(100vh-40px)] rounded-[32px] border bg-white shadow-sm overflow-hidden">

        {/* HERO */}
        <div className="p-10 border-b">

          {/* TAGS */}
          <div className="flex gap-3 mb-6">

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

          {/* TITLE */}
          <h1 className="text-6xl font-black tracking-tight leading-tight max-w-5xl">
            {course.title}
          </h1>

          {/* DESCRIPTION */}
          <p className="text-xl text-gray-500 mt-6 max-w-3xl leading-relaxed">
            {course.description}
          </p>

          {/* ACTION */}
          <div className="flex items-center gap-6 mt-10">

            <div className="text-5xl font-black">
              ₹{course.price}
            </div>

            <CourseEnrollButton
                  courseTitle={course.title}
                />

          </div>

        </div>

        {/* BODY */}
        <div className="p-10">

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* LEFT */}
            <div className="lg:col-span-2 space-y-6">

              {/* ABOUT */}
              <div className="border rounded-[32px] p-8">

                <h2 className="text-3xl font-bold mb-5">
                  About Course
                </h2>

                <p className="text-lg text-gray-500 leading-relaxed">
                  This course is specially designed for serious
                  aspirants preparing for {course.exam_name}.
                  Complete structured preparation, mentorship,
                  lectures, notes and tests will be available here.
                </p>

              </div>

              {/* FEATURES */}
              <div className="border rounded-[32px] p-8">

                <h2 className="text-3xl font-bold mb-6">
                  Course Features
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div className="border rounded-2xl p-5">
                    Live Lectures
                  </div>

                  <div className="border rounded-2xl p-5">
                    PDF Notes
                  </div>

                  <div className="border rounded-2xl p-5">
                    Mock Tests
                  </div>

                  <div className="border rounded-2xl p-5">
                    Mentorship
                  </div>

                </div>

              </div>

            </div>

            {/* RIGHT */}
            <div className="space-y-6">

              <div className="border rounded-[32px] p-8">

                <h3 className="text-2xl font-bold mb-6">
                  Course Info
                </h3>

                <div className="space-y-5">

                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      Exam
                    </p>

                    <p className="font-semibold">
                      {course.exam_name}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      Stage
                    </p>

                    <p className="font-semibold">
                      {course.stage}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      Price
                    </p>

                    <p className="font-semibold">
                      ₹{course.price}
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}