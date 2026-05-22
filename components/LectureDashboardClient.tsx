"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import LectureVideoModal from "@/components/LectureVideoModal";
import LectureTestModal from "@/components/LectureTestModal";

type SubjectRow = {
  subject_name: string;
};

type LectureRow = {
  id: number;
  lecture_title: string;
  sub_title: string;
  duration: string | null;
  video_url?: string | null;
};

interface LectureDashboardClientProps {
  courseId: number;
  courseExamName: string;
  activeSubject: string;
  subjects: SubjectRow[];
  uniqueLectures: LectureRow[];
  allLectures: LectureRow[];
  initialEnrolled: boolean;
}

export default function LectureDashboardClient({
  courseId,
  courseExamName,
  activeSubject,
  subjects,
  uniqueLectures,
  allLectures,
  initialEnrolled,
}: LectureDashboardClientProps) {
  const { user } = useUser();
  const [enrolled, setEnrolled] = useState(
    initialEnrolled
  );
  const [lectureRows, setLectureRows] = useState<LectureRow[]>(
    allLectures
  );

  useEffect(() => {
    setEnrolled(initialEnrolled);
    setLectureRows(allLectures);
  }, [initialEnrolled, allLectures]);

  useEffect(() => {
    if (!user?.id || initialEnrolled) return;

    let cancelled = false;

    const fetchEnrollment = async () => {
      try {
        const res = await fetch(
          `/api/check-enrollment?courseId=${courseId}&clerkUserId=${user.id}`
        );

        const data = await res.json();

        if (!cancelled) {
          setEnrolled(Boolean(data.enrolled));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchEnrollment();

    return () => {
      cancelled = true;
    };
  }, [courseId, initialEnrolled, user?.id]);

  useEffect(() => {
    if (!user?.id || !enrolled || initialEnrolled) return;

    let cancelled = false;

    const fetchLectureVideos = async () => {
      try {
        const res = await fetch(
          `/api/get-lecture-videos?courseId=${courseId}&subject=${encodeURIComponent(
            activeSubject
          )}&clerkUserId=${user.id}`
        );

        const data = await res.json();

        if (!cancelled && Array.isArray(data.lectures)) {
          setLectureRows(data.lectures);
        }
      } catch (error) {
        console.log(error);
        setLectureRows(allLectures);
      }
    };

    fetchLectureVideos();

    return () => {
      cancelled = true;
    };
  }, [activeSubject, allLectures, courseId, enrolled, initialEnrolled, user?.id]);

  return (
    <div
      className="
        grid
        grid-cols-1
        lg:grid-cols-4
        gap-2
      "
    >
      <div
        className="
          flex-1
          overflow-y-auto
          rounded-[32px]
          border
          border-white/[0.07]
          bg-[#0a1a16]/60
          backdrop-blur-2xl
          shadow-[inset_0_1px_1px_rgba(255,255,255,0.04)]
          h-[380px]
          flex
          flex-col
        "
      >
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
          {subjects.map((sub) => {
            const isActive =
              sub.subject_name ===
              activeSubject;

            return (
              <Link
                key={sub.subject_name}
                href={`?subject=${encodeURIComponent(
                  sub.subject_name
                )}`}
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
                        shadow-[0_0_25px_rgba(16,185,129,0.14)]
                      `
                      : `
                        border-white/[0.07]
                        bg-[#0c201a]/60
                        backdrop-blur-2xl
                        hover:border-white/[0.12]
                        hover:-translate-y-0.5
                      `
                  }
                `}
              >
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

      <div className="lg:col-span-3 space-y-1">
        {uniqueLectures.map((lecture) => (
          <div
            key={lecture.id}
            className="
              group
              relative
              overflow-hidden
              rounded-[30px]
              border
              border-white/[0.07]
              bg-[#0a1a16]/60
              backdrop-blur-2xl
              p-0
              transition-all
              duration-300
              hover:border-white/[0.12]
              hover:shadow-[0_0_30px_rgba(16,185,129,0.14)]
              shadow-[inset_0_1px_1px_rgba(255,255,255,0.04)]
            "
          >
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

            <div
              className="
                relative
                z-10
                flex
                flex-col
                lg:flex-row
                lg:items-center
                lg:justify-between
                gap-4
              "
            >
              <div className="flex items-center gap-4 p-4">
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
                />

                <div>
                  <h3
                    className="
                      text-sm
                      md:text-base
                      font-semibold
                      text-white
                    "
                  >
                    {lecture.lecture_title}
                  </h3>
                  <p
                    className="
                      text-sm
                      text-slate-400
                      mt-2
                    "
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 p-4">
                <LectureVideoModal
                  title={lecture.lecture_title}
                  videos={
                    lectureRows
                      .filter(
                        (l) =>
                          l.lecture_title ===
                          lecture.lecture_title
                      )
                      .map((l) => ({
                        sub_title: l.sub_title,
                        video_url:
                          enrolled
                            ? l.video_url || undefined
                            : undefined,
                        duration:
                          l.duration || undefined,
                      }))
                  }
                  locked={!enrolled}
                />

                <button
                  disabled={!enrolled}
                  className={`
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
                    transition-all
                    duration-300
                    ${
                      !enrolled
                        ? "cursor-not-allowed bg-white/[0.02] text-slate-500 border-white/[0.04]"
                        : "hover:bg-white/[0.08] hover:border-white/[0.12]"
                    }
                  `}
                >
                  {enrolled ? "Notes" : "🔒 Notes"}
                </button>

                <LectureTestModal
                  exam={courseExamName}
                  subject={activeSubject}
                  lectureTitle={lecture.lecture_title}
                  subTitles={
                    allLectures
                      .filter(
                        (l) =>
                          l.lecture_title ===
                          lecture.lecture_title
                      )
                      .map((l) => l.sub_title)
                  }
                  type="mcqs"
                  locked={!enrolled}
                />

                <LectureTestModal
                  exam={courseExamName}
                  subject={activeSubject}
                  lectureTitle={lecture.lecture_title}
                  subTitles={
                    allLectures
                      .filter(
                        (l) =>
                          l.lecture_title ===
                          lecture.lecture_title
                      )
                      .map((l) => l.sub_title)
                  }
                  type="pyqs"
                  locked={!enrolled}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
