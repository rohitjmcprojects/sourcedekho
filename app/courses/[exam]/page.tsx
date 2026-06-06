import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { sql } from "@/lib/db";

import EnrollmentBadge from "@/components/EnrollmentBadge";

export const dynamic = "force-dynamic";

type CourseRow = {
  id: number;
  title: string;
  description: string | null;
  price: number | string;
  is_enrolled: boolean;
};

type CourseStats = {
  course_id: number;
  subject_count: number | string;
  themes_count: number | string;
  total_lectures: number | string;
};

export default async function ExamCoursesPage({
  params,
}: {
  params: Promise<{ exam: string }>;
}) {
  const { exam } = await params;

  // ====================================
  // FETCH EXAM
  // ====================================

  const exams = await sql`
    SELECT *
    FROM exams
    WHERE LOWER(name) = LOWER(${exam})
  `;

  const examData = exams[0];

  if (!examData) {
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
            Exam not found
          </h1>
        </div>
      </main>
    );
  }

  // ====================================
  // USER
  // ====================================

  const user = await currentUser();

  const userId =
    user?.id ?? null;

  // ====================================
  // COURSES
  // ====================================

  const courses = (await sql`
    SELECT
      courses.*,

      EXISTS (
        SELECT 1
        FROM enrollments
        WHERE enrollments.course_id = courses.id
          AND enrollments.clerk_user_id = ${userId}
          AND enrollments.payment_status = 'approved'
      ) AS is_enrolled

    FROM courses

    WHERE exam_id = ${examData.id}

    ORDER BY id ASC
  `) as CourseRow[];

  const courseIds =
    courses.map((c) => c.id);

  const statsMap:
    Record<number, CourseStats> = {};

  if (courseIds.length > 0) {
    const stats = await sql`
      SELECT
        course_id,
        COUNT(DISTINCT subject_name) AS subject_count,
        COUNT(DISTINCT lecture_title) AS themes_count,
        COUNT(sub_title) AS total_lectures
      FROM lectures
      WHERE course_id = ANY(${courseIds})
      GROUP BY course_id
    `;

    for (const s of stats) {
      statsMap[s.course_id] =
        s as CourseStats;
    }
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
        {/* HEADER */}
        <div className="mb-10">
          <div
            className="
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
            {examData.name} Preparation
          </div>

          <h1
            className="
              mt-6

              text-6xl
              xl:text-7xl

              font-bold

              tracking-tight

              text-[#16212F]
            "
          >
            {examData.name}
            Courses
          </h1>

          <p
            className="
              mt-5

              max-w-3xl

              text-lg
              leading-8

              text-[#6A6A6A]
            "
          >
            {examData.description}
          </p>
        </div>

                {/* COURSES */}
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
              md:grid-cols-2
              xl:grid-cols-3

              gap-5
            "
          >
            {courses.map((course) => (
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

                  rounded-[28px]

                  border
                  border-[#D8CFC2]

                  bg-[#EFE8DE]/80

                  p-6

                  transition-all
                  duration-300

                  hover:-translate-y-1
                  hover:bg-[#E8DED2]
                "
              >
                <div
                  className="
                    flex
                    h-full
                    flex-col
                  "
                >
                  {/* TOP */}
                  <div
                    className="
                      flex
                      items-start
                      justify-between

                      gap-4
                    "
                  >
                    <div>
                      <p
                        className="
                          text-xs

                          uppercase

                          tracking-[0.14em]

                          text-[#6A6A6A]
                        "
                      >
                        {examData.name}
                      </p>
                    </div>

                    <div
                      className="
                        flex
                        flex-col
                        items-end

                        gap-2
                      "
                    >
                      <div
                        className="
                          text-3xl

                          font-bold

                          tracking-tight

                          text-[#16212F]
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
                  <div className="mt-5">
                    <h3
                      className="
                        text-[26px]

                        leading-tight

                        font-semibold

                        tracking-tight

                        text-[#16212F]
                      "
                    >
                      {course.title}
                    </h3>

                    <p
                      className="
                        mt-3

                        line-clamp-3

                        text-sm
                        leading-6

                        text-[#6A6A6A]
                      "
                    >
                      {course.description}
                    </p>
                  </div>

                  {/* STATS */}
                  <div
                    className="
                      mt-6

                      flex
                      flex-wrap

                      gap-5
                    "
                  >
                    <div>
                      <div
                        className="
                          text-xl
                          font-semibold

                          text-[#16212F]
                        "
                      >
                        {statsMap[course.id]
                          ?.subject_count ?? 0}
                      </div>

                      <div
                        className="
                          text-xs

                          text-[#6A6A6A]
                        "
                      >
                        Subjects
                      </div>
                    </div>

                    <div>
                      <div
                        className="
                          text-xl
                          font-semibold

                          text-[#16212F]
                        "
                      >
                        {statsMap[course.id]
                          ?.themes_count ?? 0}
                      </div>

                      <div
                        className="
                          text-xs

                          text-[#6A6A6A]
                        "
                      >
                        Themes
                      </div>
                    </div>

                    <div>
                      <div
                        className="
                          text-xl
                          font-semibold

                          text-[#16212F]
                        "
                      >
                        {statsMap[course.id]
                          ?.total_lectures ?? 0}
                      </div>

                      <div
                        className="
                          text-xs

                          text-[#6A6A6A]
                        "
                      >
                        Lectures
                      </div>
                    </div>
                  </div>

                  <div className="flex-1" />

                                    {/* FOOTER */}
                  <div
                    className="
                      mt-6

                      flex
                      items-center
                      justify-between
                    "
                  >
                    <div>
                      <p
                        className="
                          text-xs

                          text-[#6A6A6A]
                        "
                      >
                        {course.is_enrolled
                          ? "Enrolled"
                          : "Premium Course"}
                      </p>

                      <h4
                        className="
                          mt-1

                          text-lg

                          font-semibold

                          text-[#16212F]
                        "
                      >
                        {course.is_enrolled
                          ? "Continue"
                          : "Explore"}
                      </h4>
                    </div>

                    <div
                      className="
                        flex
                        items-center
                        justify-center

                        h-11
                        w-11

                        rounded-xl

                        border
                        border-[#D8CFC2]

                        bg-[#F7F3ED]

                        text-[#1F3D5A]

                        transition-all

                        group-hover:bg-[#16212F]
                        group-hover:text-white
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