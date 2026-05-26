// app/community/[id]/page.tsx

import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  FileText,
  PlayCircle,
  Users,
} from "lucide-react";

const communities = [
  {
    id: 1,
    name: "HCS 2026",
    slug: "hcs-2026",
    description:
      "Complete preparation community for Haryana Civil Services 2026.",
    members: 1240,
    subjects: [
      "History",
      "Polity",
      "Economics",
      "Geography",
    ],
  },

  {
    id: 2,
    name: "UPPCS 2026",
    slug: "uppcs-2026",
    description:
      "Daily classes, notes, MCQs, and PYQs for UPPCS aspirants.",
    members: 2140,
    subjects: [
      "Ancient History",
      "Modern History",
      "Science",
      "Current Affairs",
    ],
  },

  {
    id: 3,
    name: "RAS 2026",
    slug: "ras-2026",
    description:
      "Focused Rajasthan Administrative Services preparation.",
    members: 980,
    subjects: [
      "Rajasthan GK",
      "Polity",
      "Economics",
    ],
  },

  {
    id: 4,
    name: "UPSC 2027",
    slug: "upsc-2027",
    description:
      "Premium UPSC preparation ecosystem for 2027 aspirants.",
    members: 4520,
    subjects: [
      "GS",
      "Ethics",
      "Optional",
      "Essay",
    ],
  },
];

export default async function CommunityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const community = communities.find(
    (item) => item.slug === id
  );

  if (!community) {
    return (
      <div
        className="
          min-h-screen
          bg-[#07110d]
          text-white
          flex
          items-center
          justify-center
          px-4
        "
      >
        <div
          className="
            w-full
            max-w-md
            rounded-[28px]
            border
            border-white/10
            bg-white/5
            p-8
            text-center
            backdrop-blur-xl
          "
        >
          <h1 className="text-2xl font-bold">
            Community Not Found
          </h1>

          <p className="mt-3 text-slate-400">
            The community you are trying to access does not exist.
          </p>

          <Link
            href="/"
            className="
              mt-6
              inline-flex
              items-center
              justify-center
              rounded-xl
              bg-emerald-500
              px-5
              py-3
              font-medium
              text-black
              transition
              hover:scale-[1.02]
            "
          >
            Go Back
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        min-h-screen
        bg-[#07110d]
        text-white
      "
    >
      <div
        className="
          w-full
          max-w-[1120px]
          mx-auto
          xl:ml-[120px]
          px-4
          md:px-6
          py-6
        "
      >
        {/* BACK */}
        <Link
          href="/"
          className="
            inline-flex
            items-center
            gap-2
            text-sm
            text-slate-300
            hover:text-white
            transition
          "
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        {/* HERO */}
        <div
          className="
            mt-4
            rounded-[28px]
            border
            border-white/10
            bg-white/5
            p-5
            md:p-6
            backdrop-blur-xl
          "
        >
          <div
            className="
              flex
              flex-col
              gap-4
              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >
            {/* LEFT */}
            <div className="flex-1">
              <span
                className="
                  inline-flex
                  rounded-full
                  border
                  border-emerald-500/30
                  bg-emerald-500/10
                  px-4
                  py-1
                  text-xs
                  font-medium
                  text-emerald-300
                "
              >
                Community
              </span>

              <h1
                className="
                  mt-4
                  text-3xl
                  md:text-[46px]
                  leading-tight
                  font-bold
                "
              >
                {community.name}
              </h1>

              <p
                className="
                  mt-4
                  max-w-2xl
                  text-slate-300
                  text-base
                "
              >
                {community.description}
              </p>

              {/* DASHBOARD BUTTON */}
              <div className="mt-6 flex flex-wrap gap-4">
                <Link
                  href={`/community//${community.slug}/dashboard`}
                  className="
                    inline-flex
                    items-center
                    justify-center
                    rounded-xl
                    bg-emerald-500
                    px-6
                    py-3
                    font-medium
                    text-black
                    transition
                    hover:scale-[1.02]
                  "
                >
                  Open Dashboard
                </Link>
              </div>
            </div>

            {/* STATS */}
            <div
              className="
                flex
                flex-wrap
                gap-4
              "
            >
              <div
                className="
                  rounded-[24px]
                  border
                  border-white/10
                  bg-black/20
                  px-5
                  py-4
                  min-w-[135px]
                "
              >
                <div className="flex items-center gap-2 text-slate-300">
                  <Users className="w-4 h-4" />
                  Members
                </div>

                <p className="mt-3 text-3xl font-bold">
                  {community.members}+
                </p>
              </div>

              <div
                className="
                  rounded-[24px]
                  border
                  border-white/10
                  bg-black/20
                  px-5
                  py-4
                  min-w-[135px]
                "
              >
                <div className="flex items-center gap-2 text-slate-300">
                  <BookOpen className="w-4 h-4" />
                  Subjects
                </div>

                <p className="mt-3 text-3xl font-bold">
                  {community.subjects.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ACTION CARDS */}
        <div
          className="
            mt-6
            grid
            gap-5
            lg:grid-cols-3
          "
        >
          {/* VIDEO */}
          <div
            className="
              rounded-[26px]
              border
              border-white/10
              bg-white/5
              p-4
              md:p-5
              backdrop-blur-xl
            "
          >
            <div className="flex items-center gap-3">
              <PlayCircle className="w-5 h-5 text-emerald-400" />

              <h2 className="text-xl font-semibold">
                Video Lectures
              </h2>
            </div>

            <p className="mt-4 text-sm text-slate-400 leading-6">
              Watch structured topic-wise premium lectures.
            </p>

            <button
              className="
                mt-6
                w-full
                rounded-xl
                bg-emerald-500
                px-4
                py-3
                font-medium
                text-black
                transition
                hover:scale-[1.01]
              "
            >
              Explore Lectures
            </button>
          </div>

          {/* NOTES */}
          <div
            className="
              rounded-[26px]
              border
              border-white/10
              bg-white/5
              p-4
              md:p-5
              backdrop-blur-xl
            "
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-emerald-400" />

              <h2 className="text-xl font-semibold">
                Notes & PDFs
              </h2>
            </div>

            <p className="mt-4 text-sm text-slate-400 leading-6">
              Access crisp handwritten notes and PDFs.
            </p>

            <button
              className="
                mt-6
                w-full
                rounded-xl
                border
                border-white/10
                bg-white/5
                px-4
                py-3
                font-medium
                text-white
                transition
                hover:bg-white/10
              "
            >
              Open Notes
            </button>
          </div>

          {/* MCQ */}
          <div
            className="
              rounded-[26px]
              border
              border-white/10
              bg-white/5
              p-4
              md:p-5
              backdrop-blur-xl
            "
          >
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-emerald-400" />

              <h2 className="text-xl font-semibold">
                MCQs & PYQs
              </h2>
            </div>

            <p className="mt-4 text-sm text-slate-400 leading-6">
              Practice exam-oriented questions with explanations.
            </p>

            <button
              className="
                mt-6
                w-full
                rounded-xl
                border
                border-white/10
                bg-white/5
                px-4
                py-3
                font-medium
                text-white
                transition
                hover:bg-white/10
              "
            >
              Start Practice
            </button>
          </div>
        </div>

        {/* SUBJECTS */}
        <div
          className="
            mt-6
            min-h-[140px]
            rounded-[28px]
            border
            border-white/10
            bg-white/5
            p-6
            backdrop-blur-xl
          "
        >
          <h2 className="text-2xl font-bold">
            Subjects Included
          </h2>

          <div className="mt-6 flex flex-wrap gap-3">
            {community.subjects.map((subject) => (
              <div
                key={subject}
                className="
                  rounded-full
                  border
                  border-white/10
                  bg-black/20
                  px-4
                  py-2
                  text-sm
                  text-slate-200
                "
              >
                {subject}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}