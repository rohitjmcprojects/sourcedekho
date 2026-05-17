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

          p-8
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

          {/* HEADER */}
          <div className="mb-10">

            <div className="flex items-center gap-5 mb-5">

              {/* ICON */}
              <div
                className="
                  relative

                  w-14
                  h-14

                  rounded-[22px]

                  border
                  border-white/[0.08]

                  bg-gradient-to-br
                  from-blue-500/20
                  to-indigo-500/20

                  backdrop-blur-xl

                  flex
                  items-center
                  justify-center

                  text-white
                  text-xl
                  font-bold
                "
              >
                {examData.name[0]}
              </div>

              {/* TITLE */}
              <div>
                <p
                  className="
                    text-[11px]
                    font-semibold

                    tracking-[0.25em]

                    uppercase

                    text-slate-500

                    mb-1
                  "
                >
                  Exam
                </p>

                <h1
                  className="
                    text-5xl
                    font-black
                    tracking-tight

                    text-white
                  "
                >
                  {examData.name}
                </h1>
              </div>
            </div>

            {/* DESCRIPTION */}
            <p
              className="
                text-slate-400
                text-[15px]
                leading-7
                max-w-3xl
              "
            >
              {examData.description}
            </p>
          </div>

          {/* COURSES GRID */}
          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              xl:grid-cols-3
              gap-4
            "
          >
            {courses.map((course: any) => (
              <Link
                key={course.id}
                href={`/courses/${examData.name.toLowerCase()}/${course.id}`}
                className="
                  group
                  relative
                  overflow-hidden

                  rounded-[26px]

                  border
                  border-white/[0.07]

                  bg-gradient-to-br
                  from-[#18253f]/95
                  via-[#101b32]/95
                  to-[#0b1220]/95

                  backdrop-blur-2xl

                  p-5

                  min-h-[220px]

                  transition-all
                  duration-500

                  hover:-translate-y-1
                  hover:border-white/[0.12]

                  hover:shadow-[0_0_35px_rgba(59,130,246,0.14)]
                "
              >
                {/* AMBIENT GLOW */}
                <div
                  className="
                    absolute
                    -top-10
                    -right-10

                    w-40
                    h-40

                    rounded-full

                    bg-blue-500/10

                    blur-3xl

                    opacity-70

                    pointer-events-none
                  "
                />

                {/* HOVER GLOW */}
                <div
                  className="
                    absolute
                    inset-0

                    opacity-0
                    group-hover:opacity-100

                    transition-all
                    duration-500

                    bg-gradient-to-br
                    from-blue-500/10
                    via-indigo-500/5
                    to-transparent
                  "
                />

                {/* GLASS REFLECTION */}
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

                {/* INNER BORDER */}
                <div
                  className="
                    absolute
                    inset-[1px]

                    rounded-[25px]

                    border
                    border-white/[0.03]

                    pointer-events-none
                  "
                />

                {/* CONTENT */}
                <div className="relative z-10 flex flex-col h-full">

                  {/* TOP */}
                  <div className="flex justify-between items-start mb-5">

                    <div className="space-y-2">

                      {/* STAGE */}
                      <div
                        className="
                          inline-flex

                          px-3
                          py-1.5

                          rounded-2xl

                          border
                          border-white/[0.08]

                          bg-white/[0.05]

                          backdrop-blur-xl

                          text-white
                          text-xs
                          font-semibold
                        "
                      >
                        {course.stage}
                      </div>

                      {/* EXAM */}
                      <div
                        className="
                          text-xs
                          text-slate-500
                        "
                      >
                        {examData.name}
                      </div>
                    </div>

                    {/* PRICE */}
                    <div
                      className="
                        text-2xl
                        font-black

                        tracking-tight

                        text-white
                      "
                    >
                      ₹{course.price}
                    </div>
                  </div>

                  {/* TITLE */}
                  <h2
                    className="
                      text-[22px]
                      font-bold
                      leading-tight

                      text-white

                      mb-4
                    "
                  >
                    {course.title}
                  </h2>

                  {/* DESCRIPTION */}
                  <p
                    className="
                      text-[13px]
                      leading-6

                      text-slate-400
                    "
                  >
                    {course.description}
                  </p>

                  {/* SPACER */}
                  <div className="flex-1" />

                  {/* CTA */}
                  <div className="mt-6 flex justify-end">
                    <div
                      className="
                        flex
                        items-center
                        justify-center

                        w-10
                        h-10

                        rounded-2xl

                        border
                        border-white/[0.08]

                        bg-gradient-to-br
                        from-blue-500/25
                        to-indigo-500/20

                        backdrop-blur-xl

                        text-white
                        text-lg

                        transition-all
                        duration-300

                        group-hover:scale-110

                        group-hover:shadow-[0_0_20px_rgba(59,130,246,0.25)]
                      "
                    >
                      →
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}