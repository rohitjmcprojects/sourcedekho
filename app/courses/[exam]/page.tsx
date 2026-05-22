import Link from "next/link";
import { sql } from "@/lib/db";

import EnrollmentBadge from "@/components/EnrollmentBadge";

export default async function ExamCoursesPage({
  params,
}: {
  params: Promise<{ exam: string }>;
}) {

  const { exam } =
    await params;

  // ====================================
  // FETCH EXAM
  // ====================================

  const exams = await sql`
    SELECT *
    FROM exams
    WHERE LOWER(name) = LOWER(${exam})
  `;

  const examData =
    exams[0];

  if (!examData) {

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

          {/* BG */}
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
              Exam not found
            </h1>

          </div>

        </div>

      </main>
    );

  }

  // ====================================
  // FETCH COURSES
  // ====================================

  const courses = await sql`
    SELECT
      courses.*,

      EXISTS (
        SELECT 1
        FROM enrollments
        WHERE enrollments.course_id = courses.id
      ) AS is_enrolled

    FROM courses

    WHERE exam_id = ${examData.id}

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

          p-8
        "
      >

        {/* BG IMAGE */}
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

        {/* DEPTH */}
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
          <div className="mb-14">

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
              {examData.name} Preparation
            </div>

            {/* TITLE */}
            <h1
              className="
                text-7xl

                font-black

                tracking-tight
                leading-[0.95]

                text-white

                max-w-5xl
              "
            >
              {examData.name}
              Courses
            </h1>

            {/* DESCRIPTION */}
            <p
              className="
                mt-7

                max-w-2xl

                text-[17px]
                leading-8

                text-slate-300
              "
            >
              {examData.description}
            </p>

          </div>

          {/* COURSES */}
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
                href={
                  course.is_enrolled
                    ? `/courses/${examData.name.toLowerCase()}/${course.id}/dashboard`
                    : `/courses/${examData.name.toLowerCase()}/${course.id}`
                }
                className="
                  group
                  relative
                  overflow-hidden

                  rounded-[24px]

                  border
                  border-white/[0.07]

                  bg-[#0a1a16]/60

                  shadow-[inset_0_1px_1px_rgba(255,255,255,0.04)]

                  backdrop-blur-2xl

                  p-4

                  min-h-[280px]

                  transition-all
                  duration-500

                  hover:-translate-y-1.5
                  hover:border-white/[0.12]

                  hover:shadow-[0_0_40px_rgba(16,185,129,0.18)]
                "
              >

                {/* GLOW */}
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

                {/* GLASS EFFECT */}
                <div
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    bg-gradient-to-b
                    from-white/[0.05]
                    via-transparent
                    to-transparent
                  "
                />

                {/* CONTENT */}
                <div className="relative z-10 h-full flex flex-col">

                  {/* TOP BAR */}
                  <div
                    className="
                      flex
                      items-start
                      justify-between
                      gap-2
                    "
                  >

                    {/* LEFT */}
                    <div>

                      {/* EXAM TAG */}
                      <p
                        className="
                          text-slate-400
                          text-xs

                          uppercase
                          tracking-[0.15em]
                        "
                      >
                        {examData.name}
                      </p>

                    </div>

                    {/* RIGHT - PRICE + BADGE */}
                    <div className="flex flex-col items-end gap-1">
                      <div
                        className="
                          text-2xl
                          font-black

                          tracking-tight

                          text-white

                          whitespace-nowrap
                        "
                      >
                        ₹{course.price}
                      </div>
                      
                      <EnrollmentBadge
                        courseId={course.id}
                      />
                    </div>

                  </div>

                  {/* TITLE */}
                  <div className="mt-3">

                    <h3
                      className="
                        text-[20px]
                        leading-[1.1]

                        font-black

                        text-white
                      "
                    >
                      {course.title}
                    </h3>

                    {/* DESCRIPTION */}
                    <p
                      className="
                        text-slate-300

                        mt-2

                        leading-5
                        text-[12px]

                        line-clamp-2
                      "
                    >
                      {course.description}
                    </p>

                  </div>

                  {/* SPACER */}
                  <div className="flex-1" />

                  {/* FOOTER */}
                  <div
                    className="
                      flex
                      items-center
                      justify-between

                      mt-3
                    "
                  >

                    <div>

                      <p
                        className="
                          text-slate-500
                          text-xs
                        "
                      >
                        {course.is_enrolled
                          ? "Enrolled"
                          : "Premium Course"}
                      </p>

                      <h4
                        className="
                          text-lg
                          font-black

                          text-white

                          mt-0.5
                        "
                      >
                        {course.is_enrolled
                          ? "Continue"
                          : "Explore"}
                      </h4>

                    </div>

                    {/* BUTTON */}
                    <div
                      className="
                        flex
                        items-center
                        justify-center

                        w-9
                        h-9

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
                        group-hover:shadow-[0_0_20px_rgba(16,185,129,0.28)]
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
