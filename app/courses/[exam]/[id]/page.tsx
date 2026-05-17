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
  const { id } = await params;

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
        <div
          className="
            min-h-[calc(100vh-40px)]

            rounded-[32px]

            border
            border-white/[0.08]

            bg-[#0b1020]/40

            backdrop-blur-2xl

            p-10
          "
        >
          <h1 className="text-4xl font-bold text-white">
            Course not found
          </h1>
        </div>
      </main>
    );
  }

  return (
    <main className="pl-[120px] pr-5 py-5">

      {/* MAIN CONTAINER */}
      <div
        className="
          relative
          overflow-hidden

          min-h-[calc(100vh-40px)]

          rounded-[32px]

          border
          border-white/[0.08]

          bg-[#0b1020]/40

          backdrop-blur-2xl

          shadow-[0_8px_40px_rgba(0,0,0,0.25)]
        "
      >
        {/* BACKGROUND LIGHTS */}
        <div
          className="
            absolute
            -top-32
            -left-32

            w-[500px]
            h-[500px]

            bg-blue-400/20

            blur-3xl

            rounded-full

            pointer-events-none
          "
        />

        <div
          className="
            absolute
            bottom-0
            right-0

            w-[400px]
            h-[400px]

            bg-indigo-400/20

            blur-3xl

            rounded-full

            pointer-events-none
          "
        />

        {/* GLASS LIGHT */}
        <div
          className="
            absolute
            inset-0

            bg-gradient-to-b
            from-white/[0.04]
            to-transparent

            pointer-events-none
          "
        />

        {/* CONTENT */}
        <div className="relative z-10">

          {/* HERO */}
          <div
            className="
              p-8

              border-b
              border-white/[0.08]
            "
          >

            {/* TAGS */}
            <div className="flex gap-3 mb-6 flex-wrap">

              {/* EXAM */}
              <div
                className="
                  px-4
                  py-2

                  rounded-2xl

                  border
                  border-white/[0.08]

                  bg-gradient-to-br
                  from-blue-500/20
                  to-indigo-500/20

                  backdrop-blur-xl

                  text-white
                  text-sm
                  font-semibold
                "
              >
                {course.exam_name}
              </div>

              {/* STAGE */}
              <div
                className="
                  px-4
                  py-2

                  rounded-2xl

                  border
                  border-white/[0.08]

                  bg-white/[0.05]

                  backdrop-blur-xl

                  text-slate-200
                  text-sm
                  font-semibold
                "
              >
                {course.stage}
              </div>

            </div>

            {/* TITLE */}
            <h1
              className="
                text-5xl
                lg:text-6xl

                font-black

                tracking-tight
                leading-tight

                text-white

                max-w-5xl
              "
            >
              {course.title}
            </h1>

            {/* DESCRIPTION */}
            <p
              className="
                text-[16px]
                leading-8

                text-slate-400

                mt-6

                max-w-3xl
              "
            >
              {course.description}
            </p>

            {/* ACTIONS */}
            <div className="flex items-center gap-5 mt-10 flex-wrap">

              {/* PRICE */}
              <div
                className="
                  text-4xl
                  lg:text-5xl

                  font-black

                  tracking-tight

                  text-white
                "
              >
                ₹{course.price}
              </div>

              {/* ENROLL BUTTON */}
              <CourseEnrollButton
                course={course}
              />

            </div>

          </div>

          {/* BODY */}
          <div className="p-8">

            <div
              className="
                grid
                grid-cols-1
                lg:grid-cols-3
                gap-5
              "
            >

              {/* LEFT */}
              <div className="lg:col-span-2 space-y-5">

                {/* ABOUT CARD */}
                <div
                  className="
                    relative
                    overflow-hidden

                    rounded-[28px]

                    border
                    border-white/[0.07]

                    bg-gradient-to-br
                    from-[#18253f]/95
                    via-[#101b32]/95
                    to-[#0b1220]/95

                    backdrop-blur-2xl

                    p-7
                  "
                >
                  {/* LIGHT */}
                  <div
                    className="
                      absolute
                      inset-0

                      bg-gradient-to-b
                      from-white/[0.06]
                      via-transparent
                      to-transparent

                      pointer-events-none
                    "
                  />

                  {/* CONTENT */}
                  <div className="relative z-10">

                    <h2
                      className="
                        text-3xl
                        font-bold

                        text-white

                        mb-5
                      "
                    >
                      About Course
                    </h2>

                    <p
                      className="
                        text-[15px]
                        leading-8

                        text-slate-400
                      "
                    >
                      This course is specially designed for
                      serious aspirants preparing for{" "}
                      {course.exam_name}. Complete structured
                      preparation, mentorship, lectures,
                      notes and tests will be available here.
                    </p>

                  </div>
                </div>

              </div>

              {/* RIGHT */}
              <div className="space-y-5">

                {/* INFO CARD */}
                <div
                  className="
                    relative
                    overflow-hidden

                    rounded-[28px]

                    border
                    border-white/[0.07]

                    bg-gradient-to-br
                    from-[#18253f]/95
                    via-[#101b32]/95
                    to-[#0b1220]/95

                    backdrop-blur-2xl

                    p-7
                  "
                >
                  {/* LIGHT */}
                  <div
                    className="
                      absolute
                      inset-0

                      bg-gradient-to-b
                      from-white/[0.06]
                      via-transparent
                      to-transparent

                      pointer-events-none
                    "
                  />

                  {/* CONTENT */}
                  <div className="relative z-10">

                    <h3
                      className="
                        text-2xl
                        font-bold

                        text-white

                        mb-6
                      "
                    >
                      Course Info
                    </h3>

                    <div className="space-y-5">

                      {/* EXAM */}
                      <div>
                        <p
                          className="
                            text-xs

                            uppercase
                            tracking-[0.2em]

                            text-slate-500

                            mb-2
                          "
                        >
                          Exam
                        </p>

                        <p
                          className="
                            font-semibold
                            text-white
                          "
                        >
                          {course.exam_name}
                        </p>
                      </div>

                      {/* STAGE */}
                      <div>
                        <p
                          className="
                            text-xs

                            uppercase
                            tracking-[0.2em]

                            text-slate-500

                            mb-2
                          "
                        >
                          Stage
                        </p>

                        <p
                          className="
                            font-semibold
                            text-white
                          "
                        >
                          {course.stage}
                        </p>
                      </div>

                      {/* PRICE */}
                      <div>
                        <p
                          className="
                            text-xs

                            uppercase
                            tracking-[0.2em]

                            text-slate-500

                            mb-2
                          "
                        >
                          Price
                        </p>

                        <p
                          className="
                            font-semibold
                            text-white
                          "
                        >
                          ₹{course.price}
                        </p>
                      </div>

                    </div>

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