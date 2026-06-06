import Link from "next/link";
import { sql } from "@/lib/db";

import {
  ArrowRight,
  BookOpenText,
} from "lucide-react";

type ExamRow = {
  id: number;
  name: string;
};

type CommunityRow = {
  id: number;
  name: string;
  slug: string;
};

export default async function HomePage() {
  const exams = (await sql`
    SELECT *
    FROM exams
    ORDER BY id ASC
  `) as ExamRow[];

  const communities = (await sql`
    SELECT
      id,
      name,
      slug
    FROM communities
    ORDER BY id ASC
  `) as CommunityRow[];

  return (
    <main
      className="
        relative
        h-screen
        overflow-hidden

        pl-[120px]
        pr-8
        py-8
      "
    >
      {/* BACKGROUND */}
      <div
        className="
          absolute
          inset-0
          -z-10
        "
        style={{
  backgroundImage: `
    linear-gradient(
      rgba(255,255,255,0.45),
      rgba(255,255,255,0.65)
    ),
    url('/bgimg.png')
  `,
  backgroundSize: "cover",
  backgroundPosition: "center",
}}
      />

      <div
        className="
          flex
          h-full
          flex-col
          gap-5
        "
      >
        {/* TOP SECTION */}
        <div
          className="
            grid
            grid-cols-12
            gap-5
            h-[46%]
            min-h-0
          "
        >
          <div className="col-span-7">
            <LibraryCard />
          </div>

          <div className="col-span-5 min-h-0">
            <CommunityPanel
              communities={communities}
            />
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div
          className="
             flex-1
            min-h-0
          "
        >
          <ExamPanel
            exams={exams}
          />
        </div>
      </div>
    </main>
  );
}

function LibraryCard() {
  return (
    <div
  className="
    h-full

    rounded-[32px]

    border-3
    border-black/20

    bg-transparent

    p-6

    flex
    flex-col
  "
>
      {/* LIGHT EFFECT */}
      <div
        className="
          absolute
          inset-0

          bg-gradient-to-br
          from-white/20
          via-transparent
          to-transparent

          pointer-events-none
        "
      />

      <div
        className="
          relative
          z-10

          flex
          h-full
          flex-col
        "
      >

        {/* TITLE */}
        <h1
          className="
            mt-6

            text-6xl

            font-semibold

            tracking-tight

            text-slate-900
          "
        >
          Virtual

          Library
        </h1>

        {/* DESCRIPTION */}
        <p
          className="
            mt-6

            max-w-xl

            text-lg
            leading-8

            text-slate-600
          "
        >
          Notes, PDFs, PYQs,
          current affairs, books and
          premium study resources
          curated for serious aspirants.
        </p>

        <div className="flex-1" />

        
      </div>
    </div>
  );
}

function CommunityPanel({
  communities,
}: {
  communities: CommunityRow[];
}) {
  return (
    <div
  className="
    h-full

    rounded-[32px]

    border-3
    border-black/20

    bg-transparent

    p-6

    flex
    flex-col
  "
>
      <div
  className="
    mb-4

    flex
    items-center
    justify-between
  "
>
  <h2
    className="
      text-2xl
      font-semibold
      text-slate-900
    "
  >
    Communities
  </h2>

  <p
    className="
      text-sm
      text-slate-500
    "
  >
    Learn together
  </p>
</div>

      {/* LIST */}
      <div
        className="
          flex-1

          overflow-y-auto

          space-y-3
          

          pr-1
        "
      >
        {communities.map(
          (community) => (
            <Link
              key={community.id}
              href={`/community/${community.slug}`}
              className="
                group

                flex
                items-center
                justify-between

                rounded-2xl

                border-2
                border-slate-200


                bg-[#EFE8DE]/70

                shadow-sm

                px-4
                py-4

                transition-all

                hover:bg-white/90
              "
            >
              <span
                className="
                  font-medium

                  text-slate-800
                "
              >
                {community.name}
              </span>

              <ArrowRight
                className="
                  h-4
                  w-4

                  text-slate-500

                  transition-transform

                  group-hover:translate-x-1
                "
              />
            </Link>
          )
        )}
      </div>
    </div>
  );
}

function ExamPanel({
  exams,
}: {
  exams: ExamRow[];
}) {
  return (
    <div
  className="
    h-full

    rounded-[32px]

    border-3
    border-black/20

    bg-transparent

    p-6

    flex
    flex-col
  "
>
      {/* HEADER */}
      <div
        className="
          mb-5

          flex
          items-center
          gap-3
        "
      >
        <h2
          className="
            text-2xl
            font-semibold
            text-slate-900
          "
        >
          Exams
        </h2>

        <span
          className="
            text-sm
            text-slate-500
          "
        >
          - Select your preparation track
        </span>
      </div>

      {/* GRID */}
      <div
        className="
          flex-1

          grid

          grid-cols-2
          lg:grid-cols-4

          gap-5
        "
      >
        {exams.map((exam) => (
          <ExamCard
            key={exam.id}
            title={exam.name}
            href={`/courses/${exam.name.toLowerCase()}`}
          />
        ))}
      </div>
    </div>
  );
}

function ExamCard({
  href,
  title,
}: {
  href: string;
  title: string;
}) {
  return (
    <Link
      href={href}
      className="
        group

        relative

        overflow-hidden

        rounded-[26px]

        border
        border-slate-200


        bg-[#EFE8DE]/70
        shadow-md

        p-6

        transition-all
        duration-300

        hover:-translate-y-1
        hover:shadow-2xl
        hover:border-slate-300
      "
    >
      {/* TOP ACCENT */}
      <div
        className="
          absolute
          top-0
          left-0

          h-1
          w-full

          bg-gradient-to-r
          from-slate-900
          via-slate-700
          to-slate-400
        "
      />

      {/* SOFT GLOW */}
      <div
        className="
          absolute
          inset-0

          bg-gradient-to-br
          from-slate-50
          via-transparent
          to-transparent

          pointer-events-none
        "
      />

      <div
        className="
          relative
          z-10

          flex
          h-full
          flex-col
        "
      >
        {/* SMALL LABEL */}
        <div
          className="
            inline-flex
            w-fit

            rounded-full

            bg-slate-100

            px-3
            py-1

            text-[11px]
            font-medium

            text-slate-600
          "
        >
          Civil Services
        </div>

        <div className="flex-1" />

        {/* TITLE */}
        <h3
          className="
            text-3xl

            font-semibold

            tracking-tight

            text-slate-900
          "
        >
          {title}
        </h3>

        {/* FOOTER */}
        <div
          className="
            mt-5

            flex
            items-center
            justify-between
          "
        >
          <span
            className="
              text-sm

              font-medium

              text-slate-500
            "
          >
            Open Course
          </span>

          <div
            className="
              flex
              h-10
              w-10

              items-center
              justify-center

              rounded-xl

              bg-slate-100

              transition-all

              group-hover:bg-slate-900
              group-hover:text-white
            "
          >
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}