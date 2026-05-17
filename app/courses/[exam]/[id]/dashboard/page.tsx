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

      {/* MAIN WRAPPER */}
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
            via-transparent
            to-transparent

            pointer-events-none
          "
        />

        {/* CONTENT */}
        <div className="relative z-10">

          {/* HEADER */}
          <div
            className="
              p-8

              border-b
              border-white/[0.08]
            "
          >

            {/* TAGS */}
            <div className="flex gap-3 mb-5 flex-wrap">

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

            {/* SUBTITLE */}
            <p
              className="
                text-[11px]

                uppercase
                tracking-[0.25em]

                text-slate-500

                mb-3
              "
            >
              Lecture Dashboard
            </p>

            {/* TITLE */}
            <h1
              className="
                text-5xl

                font-black

                tracking-tight

                text-white
              "
            >
              {course.title}
            </h1>

          </div>

          {/* BODY */}
          <div className="p-8">

            <div
              className="
                grid
                grid-cols-1
                lg:grid-cols-4
                gap-5
              "
            >

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
                        group
                        relative
                        overflow-hidden

                        block

                        rounded-[26px]

                        border

                        p-5

                        transition-all
                        duration-300

                        ${
                          isActive
                            ? `
                              border-white/[0.08]

                              bg-gradient-to-br
                              from-blue-500/20
                              to-indigo-500/20

                              backdrop-blur-xl

                              shadow-[0_0_25px_rgba(59,130,246,0.12)]
                            `
                            : `
                              border-white/[0.06]

                              bg-gradient-to-br
                              from-[#18253f]/95
                              via-[#101b32]/95
                              to-[#0b1220]/95

                              hover:border-white/[0.12]

                              hover:-translate-y-0.5
                            `
                        }
                      `}
                    >
                      {/* REFLECTION */}
                      <div
                        className="
                          absolute
                          inset-0

                          bg-gradient-to-b
                          from-white/[0.05]
                          via-transparent
                          to-transparent

                          pointer-events-none
                        "
                      />

                      <h3
                        className="
                          relative

                          text-lg
                          font-bold

                          text-white
                        "
                      >
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

                  <h2
                    className="
                      text-3xl
                      font-bold

                      text-white
                    "
                  >
                    {activeSubject}
                  </h2>

                </div>

                {/* LECTURE LIST */}
                <div className="space-y-4">

                  {lectures.map(
                    (
                      lecture: any,
                      index: number
                    ) => (
                      <div
                        key={lecture.id}
                        className="
                          group
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

                          p-5

                          transition-all
                          duration-300

                          hover:border-white/[0.12]

                          hover:shadow-[0_0_30px_rgba(59,130,246,0.12)]
                        "
                      >
                        {/* AMBIENT GLOW */}
                        <div
                          className="
                            absolute
                            -top-12
                            -right-12

                            w-40
                            h-40

                            rounded-full

                            bg-blue-500/10

                            blur-3xl

                            opacity-70

                            pointer-events-none
                          "
                        />

                        {/* REFLECTION */}
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

                            rounded-[27px]

                            border
                            border-white/[0.03]

                            pointer-events-none
                          "
                        />

                        {/* CONTENT */}
                        <div
                          className="
                            relative
                            z-10

                            flex
                            flex-col
                            lg:flex-row
                            lg:items-center
                            lg:justify-between

                            gap-5
                          "
                        >

                          {/* LEFT */}
                          <div className="flex items-center gap-5">

                            {/* NUMBER */}
                            <div
                              className="
                                w-12
                                h-12

                                rounded-2xl

                                border
                                border-white/[0.08]

                                bg-gradient-to-br
                                from-blue-500/20
                                to-indigo-500/20

                                backdrop-blur-xl

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

                              <h3
                                className="
                                  text-xl
                                  font-bold

                                  text-white
                                "
                              >
                                {
                                  lecture.lecture_title
                                }
                              </h3>

                              <p
                                className="
                                  text-sm

                                  text-slate-400

                                  mt-2
                                "
                              >
                                {lecture.duration}

                                {lecture.notes_available &&
                                  " • Notes Included"}
                              </p>

                            </div>

                          </div>

                          {/* ACTIONS */}
                          <div className="flex flex-wrap items-center gap-3">

                            {/* VIDEO */}
                            <button
                              className="
                                px-4
                                py-3

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

                                hover:scale-[1.02]

                                transition-all
                              "
                            >
                              Video
                            </button>

                            {/* NOTES */}
                            <button
                              className="
                                px-4
                                py-3

                                rounded-2xl

                                border
                                border-white/[0.08]

                                bg-white/[0.04]

                                backdrop-blur-xl

                                text-slate-200
                                text-sm
                                font-semibold

                                hover:bg-white/[0.08]

                                transition-all
                              "
                            >
                              Notes
                            </button>

                            {/* MCQs */}
                            <button
                              className="
                                px-4
                                py-3

                                rounded-2xl

                                border
                                border-white/[0.08]

                                bg-white/[0.04]

                                backdrop-blur-xl

                                text-slate-200
                                text-sm
                                font-semibold

                                hover:bg-white/[0.08]

                                transition-all
                              "
                            >
                              MCQs
                            </button>

                            {/* PYQs */}
                            <button
                              className="
                                px-4
                                py-3

                                rounded-2xl

                                border
                                border-white/[0.08]

                                bg-white/[0.04]

                                backdrop-blur-xl

                                text-slate-200
                                text-sm
                                font-semibold

                                hover:bg-white/[0.08]

                                transition-all
                              "
                            >
                              PYQs
                            </button>

                          </div>

                        </div>

                      </div>
                    )
                  )}

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}