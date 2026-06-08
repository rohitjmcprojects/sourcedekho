import Link from "next/link";
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

  // =====================================
  // NOT FOUND
  // =====================================

  if (!course) {
    return (
      <main
        className="
          relative
          h-screen
          overflow-hidden

          pl-[120px]
          pr-8
          py-8
        "
      >
        {/* BACKGROUND */}
        <div
          className="
            absolute
            inset-0
            -z-10
          "
          style={{
            backgroundImage: `
              linear-gradient(
                rgba(255,255,255,0.45),
                rgba(255,255,255,0.65)
              ),
              url('/bgimg.png')
            `,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div
          className="
            h-full

            rounded-[32px]

            border-2
            border-black/10

            p-10
          "
        >
          <h1
            className="
              text-5xl
              font-bold

              text-[#16212F]
            "
          >
            Course not found
          </h1>
        </div>
      </main>
    );
  }

  return (
    <main
      className="
        relative

        h-screen

        overflow-hidden

        pl-[120px]
        pr-8
        py-8
      "
    >
      {/* BACKGROUND */}
      <div
        className="
          absolute
          inset-0
          -z-10
        "
        style={{
          backgroundImage: `
            linear-gradient(
              rgba(255,255,255,0.45),
              rgba(255,255,255,0.65)
            ),
            url('/bgimg.png')
          `,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* PAGE */}
      <div
        className="
          h-full

          rounded-[32px]

          border-2
          border-black/10

          p-8

          flex
          flex-col
        "
      >
        {/* HERO */}
        <div className="mb-10">

          {/* BACK */}
          <Link
            href="/"
            className="
              inline-flex
              items-center
              gap-2

              rounded-full

              border
              border-[#D8CFC2]

              bg-[#F7F3ED]

              px-4
              py-2

              text-sm
              font-medium

              text-[#16212F]

              transition-all

              hover:bg-white
            "
          >
            ← Back
          </Link>

          {/* EXAM TAG */}
          <div
            className="
              mt-6

              inline-flex

              rounded-full

              border
              border-[#D8CFC2]

              bg-[#EFE8DE]

              px-4
              py-2

              text-sm
              font-medium

              text-[#16212F]
            "
          >
            {course.exam_name}
          </div>

          {/* TITLE */}
          <h1
            className="
              mt-6

              text-5xl
              xl:text-6xl

              font-bold

              tracking-tight

              text-[#16212F]

              max-w-5xl
            "
          >
            {course.title}
          </h1>

          {/* DESCRIPTION */}
          <p
            className="
              mt-5

              max-w-3xl

              text-lg
              leading-8

              text-[#6A6A6A]
            "
          >
            {course.description}
          </p>

          {/* ACTIONS */}
          <div
            className="
              mt-8

              flex
              items-center
              gap-4
              flex-wrap
            "
          >
            {/* PRICE */}
            <div
              className="
                text-4xl

                font-bold

                text-[#16212F]
              "
            >
              ₹{course.price}
            </div>

            {/* DASHBOARD */}
            <Link
              href={`/courses/${course.exam_name.toLowerCase()}/${course.id}/dashboard`}
              className="
                rounded-2xl

                border
                border-[#D8CFC2]

                bg-[#F7F3ED]

                px-5
                py-3

                text-sm
                font-semibold

                text-[#16212F]

                transition-all

                hover:bg-white
              "
            >
              Lecture Dashboard
            </Link>

            <CourseEnrollButton
              course={course}
            />
          </div>
        </div>
                {/* BODY */}
        <div
          className="
            flex-1

            min-h-0

            overflow-y-auto
          "
        >
          <div
            className="
              grid
              grid-cols-1

              gap-6
            "
          >
            {/* ABOUT COURSE */}
            <div
              className="
                rounded-[28px]

                border
                border-[#D8CFC2]

                bg-[#EFE8DE]/80

                p-8
              "
            >
              <h2
                className="
                  text-3xl

                  font-semibold

                  tracking-tight

                  text-[#16212F]

                  mb-5
                "
              >
                About Course
              </h2>

              <p
                className="
                  text-[15px]

                  leading-8

                  text-[#6A6A6A]
                "
              >
                This course is specially
                designed for serious
                aspirants preparing for
                {" "}
                <span className="font-medium text-[#16212F]">
                  {course.exam_name}
                </span>.
                Complete structured
                preparation, mentorship,
                lectures, notes and tests
                are organized in a premium
                learning experience focused
                on consistency, conceptual
                clarity and examination
                success.
              </p>
            </div>

            {/* COURSE FEATURES */}
            <div
              className="
                grid

                grid-cols-1
                md:grid-cols-3

                gap-5
              "
            >
              <div
                className="
                  rounded-[24px]

                  border
                  border-[#D8CFC2]

                  bg-[#F7F3ED]

                  p-6
                "
              >
                <p
                  className="
                    text-sm

                    text-[#6A6A6A]
                  "
                >
                  Structured
                </p>

                <h3
                  className="
                    mt-2

                    text-xl

                    font-semibold

                    text-[#16212F]
                  "
                >
                  Learning Path
                </h3>
              </div>

              <div
                className="
                  rounded-[24px]

                  border
                  border-[#D8CFC2]

                  bg-[#F7F3ED]

                  p-6
                "
              >
                <p
                  className="
                    text-sm

                    text-[#6A6A6A]
                  "
                >
                  Premium
                </p>

                <h3
                  className="
                    mt-2

                    text-xl

                    font-semibold

                    text-[#16212F]
                  "
                >
                  Notes & Resources
                </h3>
              </div>

              <div
                className="
                  rounded-[24px]

                  border
                  border-[#D8CFC2]

                  bg-[#F7F3ED]

                  p-6
                "
              >
                <p
                  className="
                    text-sm

                    text-[#6A6A6A]
                  "
                >
                  Exam Focused
                </p>

                <h3
                  className="
                    mt-2

                    text-xl

                    font-semibold

                    text-[#16212F]
                  "
                >
                  Tests & Practice
                </h3>
              </div>
            </div>

                      </div>
        </div>
      </div>
    </main>
  );
}