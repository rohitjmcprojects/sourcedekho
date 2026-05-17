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
        {/* GLOBAL AMBIENT LIGHT */}
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
          <div className="mb-10">
            <h1
              className="
                text-5xl
                font-black
                tracking-tight
                text-white
              "
            >
              Courses
            </h1>

            <p
              className="
                mt-2
                text-sm
                text-slate-400
              "
            >
              Choose Your Exam
            </p>
          </div>

          {/* GRID */}
          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4
              2xl:grid-cols-5
              gap-4
            "
          >
            {exams.map((exam: any) => (
              <Link
                key={exam.id}
                href={`/courses/${exam.name.toLowerCase()}`}
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

                  min-h-[190px]

                  transition-all
                  duration-500

                  hover:-translate-y-1.5
                  hover:border-white/[0.12]

                  hover:shadow-[0_0_40px_rgba(59,130,246,0.16)]
                "
              >
                {/* TOP AMBIENT GLOW */}
                <div
                  className="
                    absolute
                    -top-16
                    -right-16

                    w-44
                    h-44

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
                    from-white/[0.07]
                    via-transparent
                    to-transparent

                    pointer-events-none
                  "
                />

                {/* INNER BORDER LIGHT */}
                <div
                  className="
                    absolute
                    inset-[1px]

                    rounded-[29px]

                    border
                    border-white/[0.03]

                    pointer-events-none
                  "
                />

                {/* CONTENT */}
                <div className="relative z-10 flex flex-col h-full">

                  {/* TITLE */}
                  <div className="mb-5">
                    <h2
                      className="
                        text-[22px]
                        font-bold
                        tracking-tight
                        text-white
                      "
                    >
                      {exam.name}
                    </h2>
                  </div>

                  {/* DESCRIPTION */}
                  <p
                    className="
                      text-[13px]
                      leading-6
                      text-slate-400
                    "
                  >
                    {exam.description}
                  </p>

                  {/* SPACER */}
                  <div className="flex-1" />

                  {/* BUTTON */}
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

                        group-hover:shadow-[0_0_25px_rgba(59,130,246,0.30)]
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