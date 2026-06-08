import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { sql } from "@/lib/db";
import { Info } from "lucide-react";

import LectureDashboardClient from "@/components/LectureDashboardClient";

export const dynamic = "force-dynamic";

type SubjectRow = {
  subject_name: string;
};

type LectureRow = {
  id: number;
  lecture_title: string;
  sub_title: string;
  duration: string | null;
  video_url: string | null;

  is_video_public: boolean;
  is_notes_public: boolean;
  is_pyqs_public: boolean;
  is_mcqs_public: boolean;
};

type CourseContentKey =
  | "videos"
  | "notes"
  | "mcqs"
  | "pyqs";

type CourseRow = {
  id: number;
  exam_name: string;
  title: string;
  stage?: string | null;
  [key: string]: unknown;
};

const contentFlagColumns: Record<
  CourseContentKey,
  string[]
> = {
  videos: [
    "allow_videos",
    "videos_allowed",
    "enable_videos",
    "allow_lectures",
    "lectures_allowed",
    "enable_lectures",
  ],

  notes: [
    "allow_notes",
    "notes_allowed",
    "enable_notes",
  ],

  mcqs: [
    "allow_mcqs",
    "mcqs_allowed",
    "enable_mcqs",
  ],

  pyqs: [
    "allow_pyqs",
    "pyqs_allowed",
    "enable_pyqs",
  ],
};

function isContentEnabled(
  course: CourseRow,
  key: CourseContentKey
) {
  return contentFlagColumns[key].some(
    (column) => {
      const value = course[column];

      return (
        value === true ||
        value === 1 ||
        (
          typeof value === "string" &&
          [
            "true",
            "yes",
            "1",
          ].includes(
            value.toLowerCase()
          )
        )
      );
    }
  );
}

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
  const { id } =
    await params;

  const { subject } =
    await searchParams;

  const user =
    await currentUser();

  const userId =
    user?.id;

  const courses = (await sql`
    SELECT
      courses.*,
      exams.name AS exam_name
    FROM courses
    JOIN exams
      ON exams.id = courses.exam_id
    WHERE courses.id = ${id}
  `) as CourseRow[];

  const course =
    courses[0];
    
      // ====================================
  // COURSE NOT FOUND
  // ====================================

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
            Dashboard not found
          </h1>
        </div>
      </main>
    );
  }

  // ====================================
  // ENROLLMENT
  // ====================================

  const isEnrolled = Boolean(
    userId &&
      (
        await sql`
          SELECT *
          FROM enrollments
          WHERE course_id = ${course.id}
            AND clerk_user_id = ${userId}
            AND payment_status = 'approved'
          LIMIT 1
        `
      ).length
  );

  const contentAccess = {
    videos:
      isEnrolled &&
      isContentEnabled(
        course,
        "videos"
      ),

    notes:
      isEnrolled &&
      isContentEnabled(
        course,
        "notes"
      ),

    mcqs:
      isEnrolled &&
      isContentEnabled(
        course,
        "mcqs"
      ),

    pyqs:
      isEnrolled &&
      isContentEnabled(
        course,
        "pyqs"
      ),
  };

  // ====================================
  // SUBJECTS
  // ====================================

  const subjects = (await sql`
    SELECT DISTINCT subject_name
    FROM lectures
    WHERE course_id = ${course.id}
    ORDER BY subject_name ASC
  `) as SubjectRow[];

  const activeSubject =
    subject ||
    subjects[0]?.subject_name ||
    "";

  // ====================================
  // UNIQUE LECTURES
  // ====================================

  const uniqueLectures = (
    await sql`
      SELECT
        id,
        lecture_title,
        sub_title,
        duration,
        video_url,

        is_video_public,
        is_notes_public,
        is_pyqs_public,
        is_mcqs_public

      FROM (
        SELECT DISTINCT ON (
          lecture_title
        )
          *

        FROM lectures

        WHERE course_id =
          ${course.id}

          AND subject_name =
          ${activeSubject}

        ORDER BY
          lecture_title,
          id ASC
      ) unique_lectures

      ORDER BY id ASC
    `
  ) as LectureRow[];

  // ====================================
  // ALL LECTURES
  // ====================================

  const allLectures = (
    await sql`
      SELECT
        id,
        lecture_title,
        sub_title,
        duration,
        video_url,

        is_video_public,
        is_notes_public,
        is_pyqs_public,
        is_mcqs_public

      FROM lectures

      WHERE course_id =
        ${course.id}

        AND subject_name =
        ${activeSubject}

      ORDER BY id ASC
    `
  ) as LectureRow[];

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
        <div className="mb-8">

          {/* BACK BUTTON */}
          <Link
            href={`/courses/${course.exam_name.toLowerCase()}/${course.id}`}
            className="
              inline-flex
              items-center
              gap-2

              mb-6

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
              hover:-translate-x-1
            "
          >
            ← Back
          </Link>

          {/* TOP ROW */}
          <div
            className="
              flex
              items-start
              justify-between

              gap-6
            "
          >
            {/* LEFT */}
            <div>

              <p
                className="
                  text-[11px]

                  uppercase

                  tracking-[0.25em]

                  text-[#6A6A6A]

                  mb-3
                "
              >
                Lecture Dashboard
              </p>

              <div
                className="
                  flex
                  gap-3

                  flex-wrap
                "
              >
                <div
                  className="
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

                <div
                  className="
                    rounded-full

                    border
                    border-[#D8CFC2]

                    bg-[#F7F3ED]

                    px-4
                    py-2

                    text-sm
                    font-medium

                    text-[#6A6A6A]
                  "
                >
                  {course.stage}
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <Link
              href={`/courses/${course.exam_name.toLowerCase()}/${course.id}`}
              className="
                flex
                items-center
                gap-4

                rounded-[24px]

                border
                border-[#D8CFC2]

                bg-[#EFE8DE]

                px-6
                py-4

                text-[#16212F]

                font-semibold

                transition-all

                hover:bg-[#E8DED2]
              "
            >
              {course.title}

              <Info className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* CONTENT */}
        <div
          className="
            flex-1

            min-h-0
          "
        >
          <LectureDashboardClient
            courseId={course.id}
            courseExamName={course.exam_name}
            activeSubject={activeSubject}
            subjects={subjects}
            uniqueLectures={uniqueLectures}
            allLectures={allLectures}
            initialEnrolled={isEnrolled}
            contentAccess={contentAccess}
          />
        </div>
      </div>
    </main>
  );
}