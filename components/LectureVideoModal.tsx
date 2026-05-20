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
}

export default function LectureVideoModal({
  title,
  videos = [],
}: LectureVideoModalProps) {
  const { user } = useUser();

  const [open, setOpen] = useState(false);

  const [selectedVideo, setSelectedVideo] =
    useState<VideoItem | null>(null);

  const [completedVideos, setCompletedVideos] =
    useState<string[]>([]);

  // LOAD SAVED PROGRESS
  useEffect(() => {
    const fetchProgress =
      async () => {
        if (!user?.id) return;

        try {
          const res = await fetch(
            `/api/get-progress?userId=${user.id}`
          );

          const data =
            await res.json();

          setCompletedVideos(
            data.completedVideos || []
          );
        } catch (error) {
          console.log(error);
        }
      };

    fetchProgress();
  }, [user]);

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

  return (
    <>
      {/* OPEN BUTTON */}
      <button
        onClick={() => setOpen(true)}
        className="
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
          hover:bg-blue-500/30
          transition-all
        "
      >
        ▶ Video
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
              p-4
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
                w-[95vw]
                max-w-7xl
                rounded-[32px]
                overflow-hidden
                border
                border-white/[0.08]
                bg-[#0b1220]
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
                "
              >
                <div className="flex items-start justify-between">
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
                      ml-6
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
              <div className="p-6">
                <div
                  className="
                    grid
                    grid-cols-1
                    lg:grid-cols-[380px_1fr]
                    gap-6
                    h-[70vh]
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
                      overflow-y-auto
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
                                setSelectedVideo(
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
                                </div>

                                {/* DURATION */}
                                <div className="flex items-center gap-2 mt-2 text-white/40 text-xs">
                                  <Clock3 className="w-3 h-3" />

                                  <span>
                                    {video.duration ||
                                      "10m"}
                                  </span>
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
                      flex
                      flex-col
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
                        bg-[#0b1220]
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
                    <div className="flex-1 flex items-center justify-center">
                      {selectedVideo ? (
                        <div className="w-full">
                          <div className="aspect-video w-full">
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