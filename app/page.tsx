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

      {/* MAIN CONTAINER */}
      <div
        className="
          relative
          overflow-hidden

          min-h-[calc(100vh-40px)]

          rounded-[36px]

          border
          border-white/[0.06]

          backdrop-blur-3xl

          shadow-[0_20px_80px_rgba(0,0,0,0.45)]

          before:absolute
          before:inset-0
          before:bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_30%)]

          before:pointer-events-none

          p-8
        "
      >

        {/* BACKGROUND IMAGE */}
        <div
          className="
            absolute
            inset-0
            z-0
          "
          style={{
            backgroundImage: `
              linear-gradient(
                rgba(8,17,32,0.72),
                rgba(8,17,32,0.82)
              ),
              url('/bgimg.png')
            `,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* DEPTH BLUR */}
        <div
          className="
            absolute
            inset-0

            backdrop-blur-[1px]
          "
        />

        {/* CONTENT */}
        <div className="relative z-10">

          {/* HEADER */}
          <div className="mb-12">

            {/* BADGE */}
            <div
              className="
                inline-flex

                px-5
                py-2.5

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

                mb-7
              "
            >
              SourceDekho Premium UI
            </div>

            {/* TITLE */}
            <h1
              className="
                text-6xl

                font-black

                tracking-tight
                leading-[0.95]

                text-white

                max-w-4xl
              "
            >
              Premium Learning
              Platform
            </h1>

            {/* DESCRIPTION */}
            <p
              className="
                mt-6

                max-w-2xl

                text-[16px]
                leading-8

                text-slate-300
              "
            >
              Modern immersive preparation
              experience designed for UPSC,
              PCS and state civil services
              aspirants.
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
              gap-5
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

                  rounded-[30px]

                  border
                  border-white/[0.07]

                  bg-[#0f172a]/60

                  backdrop-blur-2xl

                  p-6

                  min-h-[240px]

                  transition-all
                  duration-500

                  hover:-translate-y-1.5
                  hover:border-white/[0.12]

                  hover:shadow-[0_0_40px_rgba(59,130,246,0.16)]

                  shadow-[inset_0_1px_1px_rgba(255,255,255,0.04)]
                "
              >

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
                    from-white/[0.05]
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

                    rounded-[29px]

                    border
                    border-white/[0.03]

                    pointer-events-none
                  "
                />

                {/* CONTENT */}
                <div className="relative z-10 flex flex-col h-full">

                  {/* TOP */}
                  <div>

                    {/* TAG */}
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
                        text-[11px]
                        font-semibold

                        mb-5
                      "
                    >
                      Civil Services
                    </div>

                    {/* TITLE */}
                    <h2
                      className="
                        text-[28px]

                        font-black

                        tracking-tight
                        leading-tight

                        text-white
                      "
                    >
                      {exam.name}
                    </h2>

                    {/* DESCRIPTION */}
                    <p
                      className="
                        mt-4

                        text-[14px]
                        leading-7

                        text-slate-300
                      "
                    >
                      {exam.description}
                    </p>

                  </div>

                  {/* SPACER */}
                  <div className="flex-1" />

                  {/* FOOTER */}
                  <div className="flex items-center justify-between mt-8">

                    {/* STATS */}
                    <div>

                      <p
                        className="
                          text-xs
                          text-slate-400
                        "
                      >
                        Premium Courses
                      </p>

                      <h3
                        className="
                          text-2xl
                          font-black

                          text-white

                          mt-1
                        "
                      >
                        120+
                      </h3>

                    </div>

                    {/* CTA */}
                    <div
                      className="
                        flex
                        items-center
                        justify-center

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