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
            relative
            overflow-hidden

            min-h-[calc(100vh-40px)]

            rounded-[36px]

            border
            border-white/[0.06]

            backdrop-blur-3xl

            shadow-[0_20px_80px_rgba(0,0,0,0.45)]

            p-10
          "
        >

          {/* BG IMAGE */}
          <div
            className="
              absolute
              inset-0
            "
            style={{
              backgroundImage: `
                linear-gradient(
                  rgba(7,18,16,0.72),
                  rgba(7,18,16,0.84)
                ),
                url('/bgimg.png')
              `,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          <div className="relative z-10">
            <h1 className="text-4xl font-bold text-white">
              Course not found
            </h1>
          </div>

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

          rounded-[36px]

          border
          border-white/[0.06]

          backdrop-blur-3xl

          shadow-[0_20px_80px_rgba(0,0,0,0.45)]
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
                rgba(7,18,16,0.72),
                rgba(7,18,16,0.84)
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

        {/* NOISE */}
        <div
          className="
            absolute
            inset-0

            opacity-[0.03]

            mix-blend-soft-light

            pointer-events-none
          "
          style={{
            backgroundImage:
              "url('https://grainy-gradients.vercel.app/noise.svg')",
          }}
        />

        {/* CONTENT */}
        <div className="relative z-10">

          {/* HERO */}
          <div
            className="
              p-10

              border-b
              border-white/[0.08]
            "
          >

            {/* TAGS */}
            <div className="flex gap-3 mb-7 flex-wrap">

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
                text-6xl

                font-black

                tracking-tight
                leading-[0.95]

                text-white

                max-w-5xl
              "
            >
              {course.title}
            </h1>

            {/* DESCRIPTION */}
            <p
              className="
                mt-6

                max-w-3xl

                text-[16px]
                leading-8

                text-slate-300
              "
            >
              {course.description}
            </p>

            {/* ACTIONS */}
            <div className="flex items-center gap-5 mt-10 flex-wrap">

              {/* PRICE */}
              <div
                className="
                  text-5xl

                  font-black

                  tracking-tight

                  text-white
                "
              >
                ₹{course.price}
              </div>

              {/* ENROLL */}
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
              <div className="lg:col-span-2">

                {/* ABOUT CARD */}
                <div
                  className="
                    group
                    relative
                    overflow-hidden

                    rounded-[30px]

                    border
                    border-white/[0.07]

                    bg-[#0a1a16]/60

                    backdrop-blur-2xl

                    p-8

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

                  {/* REFLECTION */}
                  <div
                    className="
                      absolute
                      inset-0

                      bg-gradient-to-b
                      from-white/[0.05]
                      via-transparent
                      to-transparent
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
                  <div className="relative z-10">

                    <h2
                      className="
                        text-3xl

                        font-black

                        tracking-tight

                        text-white

                        mb-6
                      "
                    >
                      About Course
                    </h2>

                    <p
                      className="
                        text-[15px]
                        leading-8

                        text-slate-300
                      "
                    >
                      This course is specially designed for
                      serious aspirants preparing for{" "}
                      {course.exam_name}. Complete
                      structured preparation, mentorship,
                      lectures, notes and tests will be
                      available here.
                    </p>

                  </div>

                </div>

              </div>

              {/* RIGHT */}
              <div>

                {/* INFO CARD */}
                <div
                  className="
                    group
                    relative
                    overflow-hidden

                    rounded-[30px]

                    border
                    border-white/[0.07]

                    bg-[#0a1a16]/60

                    backdrop-blur-2xl

                    p-8

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

                  {/* REFLECTION */}
                  <div
                    className="
                      absolute
                      inset-0

                      bg-gradient-to-b
                      from-white/[0.05]
                      via-transparent
                      to-transparent
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
                  <div className="relative z-10">

                    <h3
                      className="
                        text-2xl

                        font-black

                        tracking-tight

                        text-white

                        mb-7
                      "
                    >
                      Course Info
                    </h3>

                    <div className="space-y-6">

                      {/* EXAM */}
                      <div>
                        <p
                          className="
                            text-xs

                            uppercase
                            tracking-[0.25em]

                            text-slate-500

                            mb-2
                          "
                        >
                          Exam
                        </p>

                        <p
                          className="
                            text-white
                            font-semibold
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
                            tracking-[0.25em]

                            text-slate-500

                            mb-2
                          "
                        >
                          Stage
                        </p>

                        <p
                          className="
                            text-white
                            font-semibold
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
                            tracking-[0.25em]

                            text-slate-500

                            mb-2
                          "
                        >
                          Price
                        </p>

                        <p
                          className="
                            text-white
                            font-semibold
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
