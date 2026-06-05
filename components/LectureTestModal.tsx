"use client";

import { useState } from "react";

import {
  BookOpen,
  FileQuestion,
  Lock,
  X,
} from "lucide-react";

import { createPortal } from "react-dom";

interface LectureTestModalProps {
  exam: string;
  subject: string;
  lectureTitle: string;
  subTitles: string[];
  type: "mcqs" | "pyqs";
  locked?: boolean;
}

export default function LectureTestModal({
  exam,
  subject,
  lectureTitle,
  subTitles,
  type,
  locked = false,
}: LectureTestModalProps) {
  const [open, setOpen] =
    useState(false);

  return (
    <>
      {/* OPEN BUTTON */}
      <button
        onClick={() =>
          setOpen(true)
        }
        disabled={locked}
        className={`
          h-12
          px-6
          flex
          items-center
          justify-center
          gap-2
          text-sm
          font-medium
          transition-all

          ${
            locked
              ? `
                cursor-not-allowed
                text-slate-500
              `
              : `
                text-white
                hover:bg-white/[0.05]
              `
          }
        `}
      >
        {type === "mcqs" ? (
          <>
            {locked ? (
              <Lock className="w-4 h-4" />
            ) : (
              <FileQuestion className="w-4 h-4" />
            )}

            <span>MCQs</span>
          </>
        ) : (
          <>
            {locked ? (
              <Lock className="w-4 h-4" />
            ) : (
              <BookOpen className="w-4 h-4" />
            )}

            <span>PYQs</span>
          </>
        )}
      </button>

      {/* MODAL */}
      {open &&
        createPortal(
          <div
            className="
              fixed
              inset-0
              z-[9999]
              flex
              items-center
              justify-center
              bg-black/80
              backdrop-blur-md
              p-4
            "
          >
            {/* BACKDROP */}
            <div
              className="absolute inset-0"
              onClick={() =>
                setOpen(false)
              }
            />

            {/* MAIN */}
            <div
              className="
                relative
                z-10
                w-full
                max-w-3xl
                rounded-[32px]
                overflow-hidden
                border
                border-white/[0.08]
                bg-[#071713]
                shadow-[0_20px_80px_rgba(0,0,0,0.7)]
              "
            >
              {/* HEADER */}
              <div
                className="
                  px-6
                  py-5
                  border-b
                  border-white/[0.08]
                  flex
                  items-start
                  justify-between
                  gap-4
                "
              >
                {/* LEFT */}
                <div>
                  <div className="flex items-center gap-3">
                    <div
                      className="
                        w-12
                        h-12
                        rounded-2xl
                        bg-blue-500/15
                        border
                        border-blue-500/20
                        flex
                        items-center
                        justify-center
                        text-blue-400
                      "
                    >
                      {type ===
                      "mcqs" ? (
                        <FileQuestion className="w-6 h-6" />
                      ) : (
                        <BookOpen className="w-6 h-6" />
                      )}
                    </div>

                    <div>
                      <div className="text-white text-xl font-bold">
                        {type ===
                        "mcqs"
                          ? "MCQs Test"
                          : "PYQs Test"}
                      </div>

                      <div className="text-white/50 text-sm mt-1">
                        {
                          lectureTitle
                        }
                      </div>
                    </div>
                  </div>

                  {/* META */}
                  <div className="flex flex-wrap gap-3 mt-5">
                    <div
                      className="
                        px-4
                        py-2
                        rounded-2xl
                        border
                        border-white/[0.08]
                        bg-white/[0.03]
                        text-white
                        text-sm
                      "
                    >
                      {exam}
                    </div>

                    <div
                      className="
                        px-4
                        py-2
                        rounded-2xl
                        border
                        border-white/[0.08]
                        bg-white/[0.03]
                        text-white
                        text-sm
                      "
                    >
                      {subject}
                    </div>

                    <div
                      className="
                        px-4
                        py-2
                        rounded-2xl
                        border
                        border-white/[0.08]
                        bg-white/[0.03]
                        text-white
                        text-sm
                      "
                    >
                      {subTitles.length}{" "}
                      Topics
                    </div>
                  </div>
                </div>

                {/* CLOSE */}
                <button
                  onClick={() =>
                    setOpen(false)
                  }
                  className="
                    shrink-0
                    w-10
                    h-10
                    rounded-2xl
                    bg-white/[0.06]
                    flex
                    items-center
                    justify-center
                    text-white
                    hover:bg-white/[0.10]
                    transition-all
                  "
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* BODY */}
              <div className="p-6">
                {/* SUBTOPICS */}
                <div>
                  <div className="text-white font-semibold mb-4">
                    Included Topics
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {subTitles.map(
                      (
                        sub,
                        index
                      ) => (
                        <div
                          key={index}
                          className="
                            px-4
                            py-2
                            rounded-2xl
                            border
                            border-white/[0.08]
                            bg-white/[0.03]
                            text-white/80
                            text-sm
                          "
                        >
                          {sub}
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* ACTION CARD */}
                <div
                  className="
                    mt-8
                    rounded-3xl
                    border
                    border-white/[0.08]
                    bg-gradient-to-br
                    from-blue-500/10
                    to-indigo-500/10
                    p-6
                  "
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="
                        w-14
                        h-14
                        rounded-2xl
                        bg-white/[0.06]
                        flex
                        items-center
                        justify-center
                        text-white
                        shrink-0
                      "
                    >
                      {type ===
                      "mcqs" ? (
                        <FileQuestion className="w-7 h-7" />
                      ) : (
                        <BookOpen className="w-7 h-7" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="text-white text-xl font-bold">
                        Ready to start?
                      </div>

                      <div className="text-white/60 mt-2">
                        Attempt{" "}
                        {type ===
                        "mcqs"
                          ? "MCQs"
                          : "PYQs"}{" "}
                        based on this
                        lecture and track
                        your preparation
                        progress.
                      </div>

                      <button
                        className="
                          mt-6
                          h-12
                          px-6
                          rounded-2xl
                          bg-blue-500
                          hover:bg-blue-400
                          transition-all
                          text-white
                          font-semibold
                          flex
                          items-center
                          justify-center
                          gap-2
                        "
                      >
                        {type ===
                        "mcqs" ? (
                          <FileQuestion className="w-5 h-5" />
                        ) : (
                          <BookOpen className="w-5 h-5" />
                        )}

                        Start{" "}
                        {type ===
                        "mcqs"
                          ? "MCQs"
                          : "PYQs"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* LOCKED */}
                {locked && (
                  <div
                    className="
                      mt-6
                      rounded-2xl
                      border
                      border-red-500/20
                      bg-red-500/10
                      p-4
                      flex
                      items-center
                      gap-3
                    "
                  >
                    <Lock className="w-5 h-5 text-red-400 shrink-0" />

                    <div className="text-red-200 text-sm">
                      You need to enroll
                      in this course to
                      access tests.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
