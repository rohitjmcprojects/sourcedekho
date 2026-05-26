// app/community/[id]/dashboard/page.tsx

import Link from "next/link";

import {
  ArrowLeft,
  BookOpen,
  Clock3,
  FileText,
  GraduationCap,
  PlayCircle,
  Users,
} from "lucide-react";

const dashboards = [
  {
    slug: "hcs-2026",
    name: "HCS 2026",
    members: 1240,
    progress: 62,

    subjects: [
      {
        id: 1,
        title: "History",
        lectures: 24,
      },

      {
        id: 2,
        title: "Polity",
        lectures: 18,
      },

      {
        id: 3,
        title: "Economics",
        lectures: 16,
      },

      {
        id: 4,
        title: "Geography",
        lectures: 20,
      },
    ],
  },

  {
    slug: "uppcs-2026",
    name: "UPPCS 2026",
    members: 2140,
    progress: 48,

    subjects: [
      {
        id: 1,
        title: "Ancient History",
        lectures: 14,
      },

      {
        id: 2,
        title: "Modern History",
        lectures: 22,
      },

      {
        id: 3,
        title: "Science",
        lectures: 28,
      },
    ],
  },
];

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const dashboard = dashboards.find(
    (item) => item.slug === id
  );

  if (!dashboard) {
    return (
      <div
        className="
          min-h-screen
          bg-[#07110d]
          flex
          items-center
          justify-center
          text-white
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
          <h1 className="text-3xl font-bold">
            Dashboard Not Found
          </h1>

          <p className="mt-4 text-slate-400">
            This dashboard does not exist.
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
            "
          >
            Go Home
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
          max-w-[1180px]
          mx-auto
          xl:ml-[120px]
          px-4
          md:px-6
          py-6
        "
      >
        {/* BACK */}
        <Link
          href={`/community/${dashboard.slug}`}
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
          Back to Community
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
              gap-6
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
                Dashboard
              </span>

              <h1
                className="
                  mt-4
                  text-3xl
                  md:text-[46px]
                  font-bold
                  leading-tight
                "
              >
                {dashboard.name}
              </h1>

              <p
                className="
                  mt-4
                  max-w-2xl
                  text-slate-300
                "
              >
                Continue your preparation journey with
                structured lectures, notes, MCQs,
                and PYQs.
              </p>
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
                  min-w-[140px]
                "
              >
                <div className="flex items-center gap-2 text-slate-300">
                  <Users className="w-4 h-4" />
                  Members
                </div>

                <p className="mt-3 text-3xl font-bold">
                  {dashboard.members}+
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
                  min-w-[140px]
                "
              >
                <div className="flex items-center gap-2 text-slate-300">
                  <GraduationCap className="w-4 h-4" />
                  Progress
                </div>

                <p className="mt-3 text-3xl font-bold">
                  {dashboard.progress}%
                </p>
              </div>
            </div>
          </div>

          {/* PROGRESS */}
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-300">
                Course Progress
              </p>

              <p className="text-sm font-medium">
                {dashboard.progress}%
              </p>
            </div>

            <div
              className="
                mt-3
                h-3
                w-full
                overflow-hidden
                rounded-full
                bg-white/10
              "
            >
              <div
                className="
                  h-full
                  rounded-full
                  bg-emerald-500
                "
                style={{
                  width: `${dashboard.progress}%`,
                }}
              />
            </div>
          </div>
        </div>

        

        {/* COMMUNITY FEATURES */}
        <div
          className="
            mt-6
            grid
            gap-5
            lg:grid-cols-3
          "
        >
          {/* POSTS */}
          <div
            className="
              rounded-[26px]
              border
              border-white/10
              bg-white/5
              p-5
              backdrop-blur-xl
            "
          >
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-2xl
                  bg-emerald-500/10
                  text-emerald-400
                "
              >
                <FileText className="w-5 h-5" />
              </div>

              <div>
                <h2 className="text-xl font-semibold">
                  Community Posts
                </h2>

                <p className="text-sm text-slate-400">
                  Discussions & updates
                </p>
              </div>
            </div>

            <p className="mt-5 text-sm leading-6 text-slate-400">
              Read topper strategies, important
              notices, community discussions, and
              current affairs updates.
            </p>

            <Link
              href="#"
              className="
                mt-6
                inline-flex
                w-full
                items-center
                justify-center
                rounded-xl
                bg-emerald-500
                px-4
                py-3
                text-sm
                font-medium
                text-black
                transition
                hover:scale-[1.01]
              "
            >
              Open Posts
            </Link>
          </div>

          {/* PREP STRATEGY */}
          <div
            className="
              rounded-[26px]
              border
              border-white/10
              bg-white/5
              p-5
              backdrop-blur-xl
            "
          >
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-2xl
                  bg-emerald-500/10
                  text-emerald-400
                "
              >
                <GraduationCap className="w-5 h-5" />
              </div>

              <div>
                <h2 className="text-xl font-semibold">
                  Prep Strategy
                </h2>

                <p className="text-sm text-slate-400">
                  Smart preparation plans
                </p>
              </div>
            </div>

            <p className="mt-5 text-sm leading-6 text-slate-400">
              Follow structured preparation roadmaps,
              revision cycles, study plans, and exam
              strategies.
            </p>

            <Link
              href="#"
              className="
                mt-6
                inline-flex
                w-full
                items-center
                justify-center
                rounded-xl
                border
                border-white/10
                bg-white/5
                px-4
                py-3
                text-sm
                font-medium
                text-white
                transition
                hover:bg-white/10
              "
            >
              View Strategies
            </Link>
          </div>

          {/* EXAM TOOLS */}
          <div
            className="
              rounded-[26px]
              border
              border-white/10
              bg-white/5
              p-5
              backdrop-blur-xl
            "
          >
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-2xl
                  bg-emerald-500/10
                  text-emerald-400
                "
              >
                <Clock3 className="w-5 h-5" />
              </div>

              <div>
                <h2 className="text-xl font-semibold">
                  Exam Tools
                </h2>

                <p className="text-sm text-slate-400">
                  Productivity & tracking
                </p>
              </div>
            </div>

            <p className="mt-5 text-sm leading-6 text-slate-400">
              Access study timers, syllabus trackers,
              revision planners, bookmarks, and exam
              utilities.
            </p>

            <Link
              href="#"
              className="
                mt-6
                inline-flex
                w-full
                items-center
                justify-center
                rounded-xl
                border
                border-white/10
                bg-white/5
                px-4
                py-3
                text-sm
                font-medium
                text-white
                transition
                hover:bg-white/10
              "
            >
              Open Tools
            </Link>
          </div>
        </div>

        
      </div>
    </div>
  );
}