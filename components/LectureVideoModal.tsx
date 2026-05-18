"use client";

import { useState } from "react";
import { X, PlayCircle, Clock3, BookOpen } from "lucide-react";
import { createPortal } from "react-dom";

export default function LectureVideoModal({
  title,
}: {
  title: string;
}) {
  const [detailsOpen, setDetailsOpen] =
    useState(false);

  const [playerOpen, setPlayerOpen] =
    useState(false);

  return (
    <>
      {/* BUTTON */}
      <button
        onClick={() => setDetailsOpen(true)}
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

          bg-gradient-to-br
          from-blue-500/20
          to-indigo-500/20

          backdrop-blur-xl

          text-white
          text-sm
          font-semibold

          hover:scale-[1.03]

          hover:shadow-[0_0_20px_rgba(59,130,246,0.20)]

          transition-all
          duration-300
        "
      >
        ▶
        Video
      </button>

      {/* ========================= */}
      {/* DETAILS MODAL */}
      {/* ========================= */}

      {detailsOpen &&
        createPortal(
          <div
            className="
              fixed
              inset-0
              z-[999999]

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
                setDetailsOpen(false)
              }
            />

            {/* MODAL */}
            <div
              className="
                relative
                z-10

                w-full
                max-w-2xl

                rounded-[32px]

                overflow-hidden

                border
                border-white/[0.08]

                bg-[#0b1220]

                shadow-[0_20px_100px_rgba(0,0,0,0.85)]
              "
            >
              {/* HEADER */}
              <div
                className="
                  flex
                  items-center
                  justify-between

                  px-6
                  py-5

                  border-b
                  border-white/[0.08]
                "
              >
                <h2
                  className="
                    text-white
                    text-2xl
                    font-bold
                  "
                >
                  Lecture Details
                </h2>

                <button
                  onClick={() =>
                    setDetailsOpen(false)
                  }
                  className="
                    w-11
                    h-11

                    rounded-2xl

                    bg-white/[0.06]

                    flex
                    items-center
                    justify-center

                    text-white

                    hover:bg-white/[0.12]

                    transition-all
                  "
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* CONTENT */}
              <div className="p-6 space-y-6">
                {/* TITLE */}
                <div
                  className="
                    rounded-3xl

                    border
                    border-white/[0.06]

                    bg-white/[0.03]

                    p-5
                  "
                >
                  <div
                    className="
                      text-sm
                      text-white/50
                      mb-2
                    "
                  >
                    Lecture Title
                  </div>

                  <div
                    className="
                      text-white
                      text-2xl
                      font-bold
                    "
                  >
                    {title}
                  </div>
                </div>

                {/* INFO GRID */}
                <div
                  className="
                    grid
                    grid-cols-2
                    gap-4
                  "
                >
                  <div
                    className="
                      rounded-3xl

                      border
                      border-white/[0.06]

                      bg-white/[0.03]

                      p-5
                    "
                  >
                    <Clock3 className="w-6 h-6 text-white mb-3" />

                    <div className="text-white/50 text-sm">
                      Duration
                    </div>

                    <div className="text-white font-bold text-lg">
                      2h 15m
                    </div>
                  </div>

                  <div
                    className="
                      rounded-3xl

                      border
                      border-white/[0.06]

                      bg-white/[0.03]

                      p-5
                    "
                  >
                    <BookOpen className="w-6 h-6 text-white mb-3" />

                    <div className="text-white/50 text-sm">
                      Subject
                    </div>

                    <div className="text-white font-bold text-lg">
                      Polity
                    </div>
                  </div>
                </div>

                {/* DESCRIPTION */}
                <div
                  className="
                    rounded-3xl

                    border
                    border-white/[0.06]

                    bg-white/[0.03]

                    p-5
                  "
                >
                  <div
                    className="
                      text-white
                      font-semibold
                      mb-3
                    "
                  >
                    Description
                  </div>

                  <p
                    className="
                      text-white/70
                      leading-7
                    "
                  >
                    This lecture covers important
                    concepts, PYQs, conceptual
                    understanding, and exam-focused
                    preparation for competitive exams.
                  </p>
                </div>

                {/* PLAY BUTTON */}
                <button
                  onClick={() => {
                    setDetailsOpen(false);
                    setPlayerOpen(true);
                  }}
                  className="
                    w-full

                    flex
                    items-center
                    justify-center
                    gap-3

                    py-5

                    rounded-3xl

                    bg-gradient-to-r
                    from-blue-500
                    to-indigo-500

                    text-white
                    text-lg
                    font-bold

                    hover:scale-[1.01]

                    transition-all
                    duration-300
                  "
                >
                  <PlayCircle className="w-6 h-6" />
                  Start Lecture
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* ========================= */}
      {/* PLAYER MODAL */}
      {/* ========================= */}

      {playerOpen &&
        createPortal(
          <div
            className="
              fixed
              inset-0
              z-[999999]

              flex
              items-center
              justify-center

              bg-black/90
              backdrop-blur-md

              p-4
            "
          >
            {/* BACKDROP */}
            <div
              className="absolute inset-0"
              onClick={() =>
                setPlayerOpen(false)
              }
            />

            {/* PLAYER */}
            <div
              className="
                relative
                z-10

                w-[65vw]
                max-w-6xl

                rounded-[32px]

                overflow-hidden

                border
                border-white/[0.08]

                bg-[#0b1220]

                shadow-[0_20px_100px_rgba(0,0,0,0.85)]
              "
            >
              {/* HEADER */}
              <div
                className="
                  flex
                  items-center
                  justify-between

                  px-6
                  py-5

                  border-b
                  border-white/[0.08]
                "
              >
                <div>
                  <div
                    className="
                      text-white/50
                      text-sm
                      mb-1
                    "
                  >
                    Now Playing
                  </div>

                  <h2
                    className="
                      text-white
                      text-xl
                      font-bold
                    "
                  >
                    {title}
                  </h2>
                </div>

                <button
                  onClick={() =>
                    setPlayerOpen(false)
                  }
                  className="
                    w-11
                    h-11

                    rounded-2xl

                    bg-white/[0.06]

                    flex
                    items-center
                    justify-center

                    text-white

                    hover:bg-white/[0.12]

                    transition-all
                  "
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* VIDEO */}
              <div className="aspect-video w-full bg-black">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title="Lecture Video"
                  allowFullScreen
                />
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}