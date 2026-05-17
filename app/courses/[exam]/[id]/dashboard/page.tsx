import { sql } from "@/lib/db";

export default async function LectureDashboardPage({
  params,
}: {
  params: Promise<{
    exam: string;
    id: string;
  }>;
}) {
  const { id } = await params;

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

          <p className="text-lg text-gray-500 mt-4 max-w-3xl">
            Structured learning dashboard with subjects,
            lectures, progress tracking and resources.
          </p>

        </div>

        {/* BODY */}
        <div className="p-8">

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

            {/* SUBJECTS */}
            <div className="space-y-4">

              {/* ACTIVE */}
              <div className="border rounded-[28px] p-5 bg-black text-white">

                <h3 className="text-xl font-bold">
                  Polity
                </h3>

                <p className="text-sm text-gray-300 mt-2">
                  42 Lectures
                </p>

              </div>

              {/* ITEM */}
              <div className="border rounded-[28px] p-5 hover:bg-gray-50 transition">

                <h3 className="text-xl font-bold">
                  History
                </h3>

                <p className="text-sm text-gray-500 mt-2">
                  36 Lectures
                </p>

              </div>

              {/* ITEM */}
              <div className="border rounded-[28px] p-5 hover:bg-gray-50 transition">

                <h3 className="text-xl font-bold">
                  Geography
                </h3>

                <p className="text-sm text-gray-500 mt-2">
                  28 Lectures
                </p>

              </div>

              {/* ITEM */}
              <div className="border rounded-[28px] p-5 hover:bg-gray-50 transition">

                <h3 className="text-xl font-bold">
                  Economy
                </h3>

                <p className="text-sm text-gray-500 mt-2">
                  31 Lectures
                </p>

              </div>

            </div>

            {/* LECTURES */}
            <div className="lg:col-span-3">

              {/* TOPBAR */}
              <div className="flex items-center justify-between mb-6">

                <div>

                  <h2 className="text-3xl font-bold">
                    Polity
                  </h2>

                  <p className="text-gray-500 mt-2">
                    Constitutional framework and governance.
                  </p>

                </div>

                <button
                  className="
                    px-6
                    py-3
                    rounded-2xl
                    bg-black
                    text-white
                    font-semibold
                  "
                >
                  Continue Learning
                </button>

              </div>

              {/* LECTURES LIST */}
              <div className="space-y-4">

                {/* LECTURE */}
                <div
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
                      01
                    </div>

                    {/* INFO */}
                    <div>

                      <h3 className="text-xl font-bold">
                        Historical Background
                      </h3>

                      <p className="text-gray-500 mt-2">
                        1 hr 24 min • PDF Notes Included
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

                {/* LECTURE */}
                <div
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

                    <div
                      className="
                        w-14
                        h-14
                        rounded-2xl
                        bg-gray-100
                        flex
                        items-center
                        justify-center
                        font-bold
                      "
                    >
                      02
                    </div>

                    <div>

                      <h3 className="text-xl font-bold">
                        Making of Constitution
                      </h3>

                      <p className="text-gray-500 mt-2">
                        2 hr 10 min • Notes Included
                      </p>

                    </div>

                  </div>

                  <button
                    className="
                      w-12
                      h-12
                      rounded-full
                      border
                      text-xl
                    "
                  >
                    →
                  </button>

                </div>

                {/* LECTURE */}
                <div
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

                    <div
                      className="
                        w-14
                        h-14
                        rounded-2xl
                        bg-gray-100
                        flex
                        items-center
                        justify-center
                        font-bold
                      "
                    >
                      03
                    </div>

                    <div>

                      <h3 className="text-xl font-bold">
                        Preamble
                      </h3>

                      <p className="text-gray-500 mt-2">
                        58 min • Slides Included
                      </p>

                    </div>

                  </div>

                  <button
                    className="
                      w-12
                      h-12
                      rounded-full
                      border
                      text-xl
                    "
                  >
                    →
                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}