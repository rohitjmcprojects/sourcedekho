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
    <main className="pl-[120px] pr-5 py-5">

      {/* MAIN CONTAINER */}
      <div
        className="
          relative
          overflow-hidden

          rounded-[36px]

          border
          border-white/[0.06]

          backdrop-blur-3xl

          shadow-[0_20px_80px_rgba(0,0,0,0.45)]

          before:absolute
          before:inset-0
          before:bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.14),transparent_30%)]

          before:pointer-events-none

          p-4
          md:p-5
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
                rgba(7,18,16,0.72),
                rgba(7,18,16,0.84)
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

        {/* CONTENT */}
        <div className="relative z-10">

          {/* HEADER */}
          <div className="mb-2">

            {/* BADGE */}
            <div
              className="
                inline-flex

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
              SourceDekho
            </div>
          </div>

          <HomeSection
            eyebrow="Reading Room"
            title="Virtual Library"
          >
            <div className="w-full max-w-[420px]">
              <HomeCard
                featured
                icon={<BookOpenText className="h-5 w-5" />}
                tag="Study Resources"
                title="Virtual Library"
              />
            </div>
          </HomeSection>

          <HomeSection title="Exams">
            <HomeGrid>
              {exams.map((exam) => (
                <HomeCard
                  key={exam.id}
                  href={`/courses/${exam.name.toLowerCase()}`}
                  tag="Civil Services"
                  title={exam.name}
                />
              ))}
            </HomeGrid>
          </HomeSection>

          <HomeSection title="Communities">
            <HomeGrid>
              {communities.map((community) => (
                <HomeCard
                  key={community.id}
                  tag="Community"
                  title={community.name}
                  href={`/community/${community.slug}`}
                />
              ))}
            </HomeGrid>
          </HomeSection>

        </div>

      </div>

    </main>
  );
}

function HomeSection({
  children,
  eyebrow,
  title,
}: {
  children: React.ReactNode;
  eyebrow?: string;
  title: string;
}) {
  return (
    <section className="mt-3 first:mt-0">
      <div className="mb-2 flex items-end gap-2">
        <h2 className="text-sm font-bold text-white">
          {title}
        </h2>
        {eyebrow && (
          <span className="pb-0.5 text-[10px] font-semibold uppercase text-slate-400">
            {eyebrow}
          </span>
        )}
      </div>
      {children}
    </section>
  );
}

function HomeGrid({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="
        grid
        grid-cols-1
        gap-2
        sm:grid-cols-2
        md:grid-cols-3
        xl:grid-cols-4
        2xl:grid-cols-6
      "
    >
      {children}
    </div>
  );
}

function HomeCard({
  description,
  featured = false,
  href,
  icon,
  tag,
  title,
}: {
  description?: string;
  featured?: boolean;
  href?: string;
  icon?: React.ReactNode;
  tag: string;
  title: string;
}) {
  const card = (
    <>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-transparent opacity-0 transition-all duration-500 group-hover:opacity-100" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.05] via-transparent to-transparent" />
      <div className="pointer-events-none absolute inset-[1px] rounded-[23px] border border-white/[0.03]" />

      <div className="relative z-10 flex h-full flex-col">
        <div>
          <div className="mb-1.5 inline-flex rounded-2xl border border-white/[0.08] bg-white/[0.05] px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-xl">
            {tag}
          </div>

          <h3
            className={`
              break-words
              font-black
              leading-tight
              text-white
              ${
                featured
                  ? "text-[24px]"
                  : "text-[18px]"
              }
            `}
          >
            {title}
          </h3>

          {description && (
            <p className="mt-1.5 line-clamp-2 text-xs text-slate-300">
              {description}
            </p>
          )}
        </div>

        <div className="flex-1" />

        <div className="mt-2 flex items-center">
          <div className={`${featured ? "h-10 w-10" : "h-8 w-8"} flex items-center justify-center rounded-2xl border border-white/[0.08] bg-gradient-to-br from-blue-500/20 to-indigo-500/20 text-white backdrop-blur-xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.28)]`}>
            {icon || <ArrowRight className="h-4 w-4" />}
          </div>
        </div>
      </div>
    </>
  );

  const className = `
    group
    relative
    overflow-hidden
    rounded-[24px]
    border
    border-white/[0.07]
    bg-[#0a1a16]/60
    p-3
    shadow-[inset_0_1px_1px_rgba(255,255,255,0.04)]
    backdrop-blur-2xl
    transition-all
    duration-500
    hover:-translate-y-1.5
    hover:border-white/[0.12]
    hover:shadow-[0_0_40px_rgba(16,185,129,0.18)]
    ${featured ? "min-h-[160px] p-4" : "min-h-[130px]"}
  `;

  return href ? (
    <Link href={href} className={className}>
      {card}
    </Link>
  ) : (
    <div className={className}>{card}</div>
  );
}
