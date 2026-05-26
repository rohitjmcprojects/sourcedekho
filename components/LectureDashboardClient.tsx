"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

import LectureVideoModal from "@/components/LectureVideoModal";
import LectureTestModal from "@/components/LectureTestModal";
import { NotebookPen } from "lucide-react";

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

  const [enrolled, setEnrolled] =
    useState(initialEnrolled);

  const [lectureRows, setLectureRows] =
    useState<LectureRow[]>(
      allLectures
    );

  const [loading, setLoading] =
    useState(false);

  // INIT ENROLLED
  useEffect(() => {
    setEnrolled(initialEnrolled);
  }, [initialEnrolled]);

  // RESET LECTURES
  useEffect(() => {
    setLectureRows(allLectures);
  }, [allLectures, activeSubject]);

  // CHECK ENROLLMENT
  useEffect(() => {
    if (!user?.id || initialEnrolled)
      return;

    let cancelled = false;

    const fetchEnrollment =
      async () => {
        try {
          const res = await fetch(
            `/api/check-enrollment?courseId=${courseId}&clerkUserId=${user.id}`
          );

          const data =
            await res.json();

          if (!cancelled) {
            setEnrolled(
              Boolean(data.enrolled)
            );
          }
        } catch (error) {
          console.log(error);
        }
      };

    fetchEnrollment();

    return () => {
      cancelled = true;
    };
  }, [
    courseId,
    initialEnrolled,
    user?.id,
  ]);

  // FETCH VIDEOS
  useEffect(() => {
    if (
      !user?.id ||
      !enrolled ||
      initialEnrolled
    )
      return;

    let cancelled = false;

    const fetchLectureVideos =
      async () => {
        setLoading(true);

        try {
          const res = await fetch(
            `/api/get-lecture-videos?courseId=${courseId}&subject=${encodeURIComponent(
              activeSubject
            )}&clerkUserId=${user.id}`
          );

          const data =
            await res.json();

          if (
            !cancelled &&
            Array.isArray(
              data.lectures
            )
          ) {
            setLectureRows(
              data.lectures
            );
          }
        } catch (error) {
          console.log(error);

          setLectureRows(
            allLectures
          );
        } finally {
          setLoading(false);
        }
      };

    fetchLectureVideos();

    return () => {
      cancelled = true;
    };
  }, [
    activeSubject,
    courseId,
    enrolled,
    initialEnrolled,
    user?.id,
  ]);

  return (
    <div
      className="
        grid
        grid-cols-1
        lg:grid-cols-4
        gap-2
      "
    >
      {/* SUBJECTS */}
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
            p-3
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
            p-1
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
                  flex
                  items-center
                  justify-between
                  px-4
                  py-3
                  rounded-2xl
                  transition-all
                  border

                  ${
                    isActive
                      ? `
                        border-blue-500/30
                        bg-blue-500/15
                        text-white
                      `
                      : `
                        border-transparent
                        text-slate-400
                        hover:text-white
                        hover:bg-white/[0.03]
                      `
                  }
                `}
              >
                <h3 className="font-medium">
                  {sub.subject_name}
                </h3>
              </Link>
            );
          })}
        </div>
      </div>

      {/* LECTURES */}
      <div className="lg:col-span-3 space-y-1">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="h-12 w-12 rounded-full border-4 border-t-blue-400 animate-spin" />
          </div>
        ) : (
          <>
            {uniqueLectures.map(
              (lecture, index) => (
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
                  {/* HOVER EFFECT */}
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

                  {/* TOP LIGHT */}
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
                      gap-4
                    "
                  >
                    {/* LEFT */}
                    <div className="flex items-center gap-3 px-4 py-2 h-full">
                      <div
                        className="
                          w-8
                          h-10
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
                          {
                            allLectures.filter(
                              (l) =>
                                l.lecture_title ===
                                lecture.lecture_title
                            ).length
                          }{" "}
                          lectures
                        </p>
                      </div>
                    </div>

                    {/* ACTION BAR */}
                    <div
                      className="
                        flex
                        items-stretch
                        overflow-hidden
                        rounded-2xl
                        border
                        border-white/[0.08]
                        bg-white/[0.03]
                        backdrop-blur-xl
                        shrink-0
                        mr-4
                      "
                    >
                      {/* VIDEO */}
                      <LectureVideoModal
                        title={
                          lecture.lecture_title
                        }
                        videos={lectureRows
                          .filter(
                            (l) =>
                              l.lecture_title ===
                              lecture.lecture_title
                          )
                          .map((l) => ({
                            sub_title:
                              l.sub_title,

                            video_url:
                              enrolled
                                ? l.video_url ||
                                  undefined
                                : undefined,

                            duration:
                              l.duration ||
                              undefined,
                          }))}
                        locked={!enrolled}
                      />

                      {/* DIVIDER */}
                      <div className="w-px bg-white/[0.08]" />

                      {/* NOTES */}
                      <button
                        disabled={
                          !enrolled
                        }
                        className={`
                          h-12
                          px-4
                          flex
                          items-center
                          justify-center
                          text-sm
                          font-medium
                          transition-all
                          gap-2
                          ${
                            !enrolled
                              ? "cursor-not-allowed text-slate-500"
                              : "text-white hover:bg-white/[0.05]"
                          }
                        `}
                      >
                        
                        <NotebookPen className="w-4 h-4" />

                      <span>
                        {enrolled
                          ?  " Notes"
                          : "🔒 Notes"} </span>
                      </button>

                      {/* DIVIDER */}
                      <div className="w-px bg-white/[0.08]" />

                      {/* MCQS */}
                      <LectureTestModal
                        exam={
                          courseExamName
                        }
                        subject={
                          activeSubject
                        }
                        lectureTitle={
                          lecture.lecture_title
                        }
                        subTitles={allLectures
                          .filter(
                            (l) =>
                              l.lecture_title ===
                              lecture.lecture_title
                          )
                          .map(
                            (l) =>
                              l.sub_title
                          )}
                        type="mcqs"
                        locked={
                          !enrolled
                        }
                      />

                      {/* DIVIDER */}
                      <div className="w-px bg-white/[0.08]" />

                      {/* PYQS */}
                      <LectureTestModal
                        exam={
                          courseExamName
                        }
                        subject={
                          activeSubject
                        }
                        lectureTitle={
                          lecture.lecture_title
                        }
                        subTitles={allLectures
                          .filter(
                            (l) =>
                              l.lecture_title ===
                              lecture.lecture_title
                          )
                          .map(
                            (l) =>
                              l.sub_title
                          )}
                        type="pyqs"
                        locked={
                          !enrolled
                        }
                      />
                    </div>
                  </div>
                </div>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
}