"use client";

import { useEffect, useState } from "react";

import {
  X,
  PlayCircle,
  CheckCircle2,
  Clock3,
} from "lucide-react";

import { createPortal } from "react-dom";

import { useUser } from "@clerk/nextjs";

interface VideoItem {
  sub_title: string;
  video_url?: string;
  duration?: string;
}

interface LectureVideoModalProps {
  title: string;
  videos?: VideoItem[];
  locked?: boolean;
}

export default function LectureVideoModal({
  title,
  videos = [],
  locked = false,
}: LectureVideoModalProps) {
  const { user } = useUser();

  const [open, setOpen] = useState(false);

  const [selectedVideo, setSelectedVideo] =
    useState<VideoItem | null>(null);

  const [completedVideos, setCompletedVideos] =
    useState<string[]>([]);

  // CURRENT INDEX
  const currentIndex =
    videos.findIndex(
      (v) =>
        v.sub_title ===
        selectedVideo?.sub_title
    );

  // LOAD SAVED PROGRESS + LAST WATCHED
  useEffect(() => {
    const fetchData =
      async () => {
        if (!user?.id) return;

        try {
          // COMPLETED VIDEOS
          const progressRes =
            await fetch(
              `/api/get-progress?userId=${user.id}`
            );

          const progressData =
            await progressRes.json();

          setCompletedVideos(
            progressData.completedVideos ||
              []
          );

          // LAST WATCHED
          const lastRes =
            await fetch(
              `/api/get-last-watched?userId=${user.id}`
            );

          const lastData =
            await lastRes.json();

          if (!lastData) return;

          const matchedVideo =
            videos.find(
              (v) =>
                v.sub_title ===
                lastData.sub_title
            );

          if (matchedVideo) {
            setSelectedVideo(
              matchedVideo
            );
          }
        } catch (error) {
          console.log(error);
        }
      };

    fetchData();
  }, [user?.id, title]);

  // SAVE LAST WATCHED
  const handleVideoSelect =
    async (video: VideoItem) => {
      setSelectedVideo(video);

      try {
        await fetch(
          "/api/set-last-watched",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              userId: user?.id,

              lectureTitle: title,

              subTitle:
                video.sub_title,
            }),
          }
        );
      } catch (error) {
        console.log(error);
      }
    };

  // AUTO NEXT
  const playNextLecture =
    async () => {
      if (
        currentIndex === -1
      )
        return;

      // AUTO COMPLETE CURRENT
      if (
        selectedVideo &&
        !completedVideos.includes(
          selectedVideo.sub_title
        )
      ) {
        await toggleCompleted(
          selectedVideo.sub_title
        );
      }

      const nextVideo =
        videos[currentIndex + 1];

      if (!nextVideo) return;

      await handleVideoSelect(
        nextVideo
      );
    };

  // PREVIOUS
  const playPreviousLecture =
    async () => {
      if (
        currentIndex <= 0
      )
        return;

      const prevVideo =
        videos[currentIndex - 1];

      if (!prevVideo) return;

      await handleVideoSelect(
        prevVideo
      );
    };

  // TOGGLE COMPLETE
  const toggleCompleted = async (
    videoTitle: string
  ) => {
    const alreadyCompleted =
      completedVideos.includes(
        videoTitle
      );

    const updated =
      alreadyCompleted
        ? completedVideos.filter(
            (v) => v !== videoTitle
          )
        : [
            ...completedVideos,
            videoTitle,
          ];

    setCompletedVideos(updated);

    try {
      await fetch(
        "/api/save-progress",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            userId: user?.id,

            lectureTitle: title,

            subTitle: videoTitle,

            completed:
              !alreadyCompleted,
          }),
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  // PROGRESS
  const progress =
    videos.length > 0
      ? Math.round(
          (completedVideos.length /
            videos.length) *
            100
        )
      : 0;

  const openModal = () => {
    if (locked) return;
    setOpen(true);
  };

  return (
    <>
      {/* OPEN BUTTON */}
      <button
        type="button"
        onClick={openModal}
        disabled={locked}
        className={`
          group
          flex
          items-center
          gap-2
          px-5
          py-3
          rounded-2xl
          border
          border-white/[0.08]
          bg-blue-500/20
          text-white
          text-sm
          font-semibold
          transition-all
          ${locked ? "cursor-not-allowed bg-white/[0.05] text-slate-500" : "hover:bg-blue-500/30"}
        `}
      >
        {locked ? "🔒 Locked" : "▶ Video"}
      </button>

      {/* MODAL */}
      {open &&
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
              px-4
              py-2
            "
          >
            {/* BACKDROP */}
            <div
              className="absolute inset-0"
              onClick={() => {
                setOpen(false);
                setSelectedVideo(null);
              }}
            />

            {/* MAIN */}
            <div
              className="
              relative
              z-10
              w-full
              max-w-[1400px]
              h-[92vh]
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
                  py-3
                  border-b
                  border-white/[0.08]
                "
              >
                <div className="flex items-start gap-4">
                  {/* LEFT */}
                  <div className="flex-1">
                    <div className="text-white/50 text-sm">
                      Lecture Topic
                    </div>

                    <h2 className="text-white text-2xl font-bold mt-1">
                      {title}
                    </h2>

                    {/* PROGRESS */}
                    <div className="mt-5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white/60 text-sm">
                          Course Progress
                        </span>

                        <span className="text-blue-400 text-sm font-semibold">
                          {progress}%
                        </span>
                      </div>

                      <div
                        className="
                          h-3
                          rounded-full
                          bg-white/[0.06]
                          overflow-hidden
                        "
                      >
                        <div
                          className="
                            h-full
                            rounded-full
                            bg-gradient-to-r
                            from-blue-500
                            to-cyan-400
                            transition-all
                            duration-500
                          "
                          style={{
                            width: `${progress}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* CLOSE */}
                  <button
                    onClick={() => {
                      setOpen(false);
                      setSelectedVideo(null);
                    }}
                    className="
                      ml-auto shrink-0
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
              </div>

              {/* BODY */}
              <div className="p-4">
                <div
                  className="
                    grid
                    grid-cols-1
                    lg:grid-cols-[380px_1fr]
                    gap-4
                    min-h-[85vh] max-h-[92vh]
                  "
                >
                  {/* LEFT PANEL */}
                  <div
                    className="
                      rounded-3xl
                      border
                      border-white/[0.08]
                      bg-white/[0.03]
                      p-4
                      overflow-y-auto max-h-[calc(100vh-250px)]
                    "
                  >
                    <div className="text-white font-semibold mb-4">
                      Lecture Videos
                    </div>

                    <div className="space-y-3">
                      {videos.length > 0 ? (
                        videos.map(
                          (
                            video,
                            index
                          ) => (
                            <div
                              key={index}
                              onClick={() =>
                                handleVideoSelect(
                                  video
                                )
                              }
                              className={`
                                cursor-pointer
                                w-full
                                flex
                                items-start
                                justify-between
                                px-4
                                py-4
                                rounded-2xl
                                border
                                transition-all

                                ${
                                  selectedVideo?.sub_title ===
                                  video.sub_title
                                    ? `
                                      border-blue-500/40
                                      bg-blue-500/15
                                    `
                                    : `
                                      border-white/[0.06]
                                      bg-white/[0.03]
                                      hover:bg-blue-500/10
                                    `
                                }
                              `}
                            >
                              {/* LEFT */}
                              <div className="pr-4 flex-1">
                                <div className="flex items-center gap-2">
                                  {completedVideos.includes(
                                    video.sub_title
                                  ) && (
                                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                                  )}

                                  <span className="text-white font-medium">
                                    {
                                      video.sub_title
                                    }
                                  </span>
                                  <span className="flex items-center gap-2 mt-2 text-white/40 text-xs">
                                  <div className="flex items-center gap-2 mt-2 text-white/40 text-xs">
                                  <Clock3 className="w-3 h-3" />
                                    {
                                      (video.duration)
                                    }
                                  </div></span>
                                </div>

                              </div>

                              {/* PLAY ICON */}
                              <PlayCircle
                                className="
                                  w-6
                                  h-6
                                  text-white
                                  hover:text-blue-400
                                  transition-all
                                  shrink-0
                                  mt-1
                                "
                              />
                            </div>
                          )
                        )
                      ) : (
                        <div className="text-white/50 text-sm">
                          No videos available
                        </div>
                      )}
                    </div>
                  </div>

                  {/* RIGHT PLAYER */}
                  <div
                    className="
                      rounded-3xl
                      overflow-hidden
                      border
                      border-white/[0.08]
                      bg-black
                      flex flex-col overflow-hidden
                    "
                  >
                    {/* TOP BAR */}
                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        px-5
                        py-4
                        border-b
                        border-white/[0.08]
                        bg-[#071713]
                      "
                    >
                      <div>
                        <div className="text-white/50 text-xs">
                          Current Lecture
                        </div>

                        <div className="text-white font-semibold mt-1">
                          {selectedVideo?.sub_title ||
                            "No lecture selected"}
                        </div>
                      </div>

                      {/* COMPLETE BUTTON */}
                      {selectedVideo && (
                        <button
                          onClick={() =>
                            toggleCompleted(
                              selectedVideo.sub_title
                            )
                          }
                          className={`
                            flex
                            items-center
                            gap-2
                            px-4
                            py-2
                            rounded-2xl
                            text-sm
                            font-semibold
                            transition-all

                            ${
                              completedVideos.includes(
                                selectedVideo.sub_title
                              )
                                ? `
                                  bg-green-500/20
                                  text-green-400
                                  border
                                  border-green-500/20
                                `
                                : `
                                  bg-white/[0.06]
                                  text-white/80
                                  border
                                  border-white/[0.08]
                                  hover:bg-white/[0.10]
                                `
                            }
                          `}
                        >
                          <CheckCircle2 className="w-4 h-4" />

                          {completedVideos.includes(
                            selectedVideo.sub_title
                          )
                            ? "Completed"
                            : "Mark as Completed"}
                        </button>
                      )}
                    </div>

                    {/* VIDEO AREA */}
                    <div className="flex-1 overflow-y-auto">
                      {selectedVideo ? (
                        <div className="w-full">
                          <div className="aspect-video w-full max-h-[46vh]">
                            {selectedVideo.video_url ? (
                              <iframe
                                className="w-full h-full"
                                src={
                                  selectedVideo.video_url
                                    ?.replace(
                                      "watch?v=",
                                      "embed/"
                                    ) ||
                                  undefined
                                }
                                title={
                                  selectedVideo.sub_title
                                }
                                allowFullScreen
                              />
                            ) : (
                              <div
                                className="
                                  w-full
                                  h-full
                                  flex
                                  items-center
                                  justify-center
                                  bg-black
                                  text-white/50
                                  text-lg
                                "
                              >
                                Video URL not added yet
                              </div>
                            )}
                          </div>

                          {/* PLAYER CONTROLS */}
                          <div
                            className="
                              flex
                              items-center
                              justify-between
                              px-5
                              py-4
                              border-t
                              border-white/[0.08]
                              bg-[#071713]
                            "
                          >
                            {/* PREVIOUS */}
                            <button
                              onClick={
                                playPreviousLecture
                              }
                              disabled={
                                currentIndex <=
                                0
                              }
                              className="
                                px-4
                                py-2
                                rounded-2xl
                                bg-white/[0.06]
                                text-white
                                disabled:opacity-30
                              "
                            >
                              ← Previous
                            </button>

                            {/* COUNT */}
                            <div className="text-white/60 text-sm">
                              Lecture{" "}
                              {currentIndex +
                                1}{" "}
                              /{" "}
                              {
                                videos.length
                              }
                            </div>

                            {/* NEXT */}
                            <button
                              onClick={
                                playNextLecture
                              }
                              disabled={
                                currentIndex >=
                                videos.length -
                                  1
                              }
                              className="
                                px-4
                                py-2
                                rounded-2xl
                                bg-blue-500/20
                                text-white
                                disabled:opacity-30
                              "
                            >
                              Next →
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <PlayCircle className="w-14 h-14 text-white/30 mx-auto mb-4" />

                          <div className="text-white/70 text-lg font-medium">
                            Select a lecture
                          </div>

                          <div className="text-white/40 text-sm mt-2">
                            Choose a video from left panel
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
