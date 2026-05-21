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
                  rgba(8,17,32,0.72),
                  rgba(8,17,32,0.82)
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
                rgba(8,17,32,0.72),
                rgba(8,17,32,0.82)
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
              gap-6
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

                  rounded-[34px]

                  border
                  border-white/[0.08]

                  bg-[rgba(15,23,42,0.72)]

                  backdrop-blur-2xl

                  p-7

                  min-h-[340px]

                  transition-all
                  duration-500

                  hover:-translate-y-2
                  hover:border-blue-400/20

                  hover:shadow-[0_0_50px_rgba(59,130,246,0.18)]
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
                    via-transparent
                    to-indigo-500/10
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
                      gap-4
                    "
                  >

                    {/* LEFT */}
                    <div>

                      {/* ENROLLMENT */}
                      <EnrollmentBadge
                        courseId={course.id}
                      />

                    </div>

                    {/* RIGHT */}
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

                  </div>

                  {/* EXAM */}
                  <div className="mt-8">

                    <p
                      className="
                        text-slate-400
                        text-sm

                        uppercase
                        tracking-[0.2em]
                      "
                    >
                      {examData.name}
                    </p>

                    {/* TITLE */}
                    <h3
                      className="
                        text-[38px]
                        leading-[1.05]

                        font-black

                        text-white

                        mt-5
                      "
                    >
                      {course.title}
                    </h3>

                    {/* DESCRIPTION */}
                    <p
                      className="
                        text-slate-300

                        mt-6

                        leading-8
                        text-[15px]
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

                      mt-10
                    "
                  >

                    <div>

                      <p
                        className="
                          text-slate-500
                          text-sm
                        "
                      >
                        Premium Course
                      </p>

                      <h4
                        className="
                          text-3xl
                          font-black

                          text-white

                          mt-1
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

                        w-16
                        h-16

                        rounded-3xl

                        border
                        border-white/[0.08]

                        bg-gradient-to-br
                        from-blue-500/20
                        to-indigo-500/20

                        backdrop-blur-xl

                        text-white
                        text-2xl

                        transition-all
                        duration-300

                        group-hover:translate-x-1
                        group-hover:scale-110
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