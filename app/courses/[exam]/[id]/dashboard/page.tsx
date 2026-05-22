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
};

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

  const user = await currentUser();
  const userId = user?.id;

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
            relative
            overflow-hidden

            

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
              Dashboard not found
            </h1>
          </div>
        </div>
      </main>
    );
  }

  const isEnrolled = Boolean(
    userId &&
      (
        await sql`
          SELECT *
          FROM enrollments
          WHERE course_id = ${course.id}
            AND clerk_user_id = ${userId}
          LIMIT 1
        `
      ).length
  );

  // FETCH SUBJECTS
  const subjects = (await sql`
    SELECT DISTINCT subject_name
    FROM lectures
    WHERE course_id = ${course.id}
    ORDER BY subject_name ASC
  `) as SubjectRow[];

  const activeSubject =
    subject || subjects[0]?.subject_name || "";

  // FETCH LECTURES
  const uniqueLectures = isEnrolled
    ? (await sql`
        SELECT id, lecture_title, sub_title, duration, video_url
        FROM (
          SELECT DISTINCT ON (lecture_title)
            *
          FROM lectures
          WHERE course_id = ${course.id}
            AND subject_name = ${activeSubject}
          ORDER BY lecture_title, id ASC
        ) unique_lectures
        ORDER BY id ASC
      `) as LectureRow[]
    : (await sql`
        SELECT id, lecture_title, sub_title, duration
        FROM (
          SELECT DISTINCT ON (lecture_title)
            id, lecture_title, sub_title, duration
          FROM lectures
          WHERE course_id = ${course.id}
            AND subject_name = ${activeSubject}
          ORDER BY lecture_title, id ASC
        ) unique_lectures
        ORDER BY id ASC
      `) as LectureRow[];

  const allLectures = isEnrolled
    ? (await sql`
        SELECT id, lecture_title, sub_title, duration, video_url
        FROM lectures
        WHERE course_id = ${course.id}
          AND subject_name = ${activeSubject}
        ORDER BY id ASC
      `) as LectureRow[]
    : (await sql`
        SELECT id, lecture_title, sub_title, duration
        FROM lectures
        WHERE course_id = ${course.id}
          AND subject_name = ${activeSubject}
        ORDER BY id ASC
      `) as LectureRow[];

  return (
    <main className="pl-[120px] pr-5 py-5" >

      
      {/* MAIN WRAPPER */}
      <div
        className="
          relative
          overflow-hidden

          
          rounded-[36px]

          border
          border-white/[0.06]

          backdrop-blur-3xl

          shadow-[0_20px_80px_rgba(0,0,0,0.45)]

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

          {/* HEADER */}
          <div className="mb-1">

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

            {/* BADGES */}
            <div className="flex gap-3 mb-6 flex-wrap">

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
            </div>

            {/* Right */}
            <div>

            {/* TITLE */}
                    <Link
                      href={`/courses/${course.exam_name.toLowerCase()}/${course.id}/dashboard`}
                      className="
                        flex
                        items-center
                        gap-5

                        px-8
                        py-4

                        rounded-4xl

                        border
                        border-white/10

                        bg-indigo-500/20

                        text-white
                        font-semibold
                        text-lg

                        hover:bg-indigo-500/30

                        transition-all
                      "
                    >
                      {course.title}                      
                      <Info className="w-5 h-5" />

                    </Link>
          </div>
          </div>
          </div>

          {/* BODY */}
          <LectureDashboardClient
            courseId={course.id}
            courseExamName={course.exam_name}
            activeSubject={activeSubject}
            subjects={subjects}
            uniqueLectures={uniqueLectures}
            allLectures={allLectures}
            initialEnrolled={isEnrolled}
          />

        </div>

      </div>

    </main>
  );
}
