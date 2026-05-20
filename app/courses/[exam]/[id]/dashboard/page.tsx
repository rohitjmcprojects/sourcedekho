import Link from "next/link";
import { sql } from "@/lib/db";
import { Info } from "lucide-react";
import LectureVideoModal from "@/components/LectureVideoModal";


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
              Dashboard not found
            </h1>
          </div>
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
  const uniqueLectures = await sql`
  SELECT *
  FROM (
    SELECT DISTINCT ON (lecture_title)
      *
    FROM lectures
    WHERE course_id = ${course.id}
      AND subject_name = ${activeSubject}
    ORDER BY lecture_title, id ASC
  ) unique_lectures
  ORDER BY id ASC
`;

const allLectures = await sql`
  SELECT *
  FROM lectures
  WHERE course_id = ${course.id}
    AND subject_name = ${activeSubject}
  ORDER BY id ASC
`;

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
                    <a
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

                    </a>
          </div>
          </div>
          </div>

          {/* BODY */}
          <div
            className="
              grid
              grid-cols-1
              lg:grid-cols-4
              gap-2
            "
          >

            {/* SUBJECTS CARD */}
                <div
                  className="
                    flex-1
                    overflow-y-auto

                   
                    rounded-[32px]
                     
                    border
                    border-white/[0.07]

                    bg-[#0f172a]/60

                    backdrop-blur-2xl

                    shadow-[inset_0_1px_1px_rgba(255,255,255,0.04)]

                    h-[380px]

                    flex
                    flex-col
                  "
                >

                  {/* CARD HEADER */}
                  <div
                    className="
                      p-4

                      border-b
                      border-white/[0.06]

                      bg-gradient-to-r
                      from-blue-500/10
                      to-indigo-500/10
                    "
                  >
                    <h2
                      className="
                        text-1xl
                        font-black
                        text-white
                        tracking-tight
                      "
                    >
                      SUBJECTS
                    </h2>

                  </div>

                  {/* SCROLLABLE SUBJECTS */}
                  <div
                    className="
                      flex-1
                      overflow-y-auto

                      p-4
                      space-y-1
                      

                      scrollbar-thin
                      scrollbar-thumb-white/10
                      scrollbar-track-transparent
                    "
                  >
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

                            rounded-[24px]

                            border

                            p-2

                            transition-all
                            duration-300

                            shadow-[inset_0_1px_1px_rgba(255,255,255,0.04)]

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
                                  border-white/[0.07]

                                  bg-[#111827]/60

                                  backdrop-blur-2xl

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

                          {/* INNER BORDER */}
                          <div
                            className="
                              absolute
                              inset-[1px]

                              rounded-[23px]

                              border
                              border-white/[0.03]

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
                </div>

            {/* LECTURES */}
            <div className="lg:col-span-3">

              {/* LECTURES */}
              <div className="space-y-1">
                                {uniqueLectures.map(
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

                        rounded-[30px]

                        border
                        border-white/[0.07]

                        bg-[#0f172a]/60

                        backdrop-blur-2xl

                        p-0

                        transition-all
                        duration-300

                        hover:border-white/[0.12]

                        hover:shadow-[0_0_30px_rgba(59,130,246,0.12)]

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
                              w-14
                              h-14

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

                          </div>

                          {/* INFO */}
                          <div>

                            <h3
                              className="
                               text-sm
                                    md:text-base

                                    font-semibold

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
                              
                            </p>

                          </div>

                        </div>

                        {/* ACTIONS */}
                        <div className="flex flex-wrap items-center gap-3">

                          {/* VIDEO */}
<LectureVideoModal
  title={lecture.lecture_title}
  videos={
    allLectures
      .filter(
        (l: any) =>
          l.lecture_title ===
          lecture.lecture_title
      )
      .map((l: any) => ({
        sub_title: l.sub_title,
        video_url: l.video_url,
        duration: l.duration,
      }))
  }
/>
                          {/* NOTES */}
                          <button
                            className="
                              group

                              flex
                              items-center
                              gap-2.5

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

                              hover:border-white/[0.12]

                              transition-all
                              duration-300
                            "
                          >
                            📄
                            Notes
                          </button>

                          {/* MCQs */}
                          <button
                            className="
                              group

                              flex
                              items-center
                              gap-2.5

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

                              hover:border-white/[0.12]

                              transition-all
                              duration-300
                            "
                          >
                            ✔
                            MCQs
                          </button>

                          {/* PYQs */}
                          <button
                            className="
                              group

                              flex
                              items-center
                              gap-2.5

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

                              hover:border-white/[0.12]

                              transition-all
                              duration-300
                            "
                          >
                            📊
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

    </main>
  );
}