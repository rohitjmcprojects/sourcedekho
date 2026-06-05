// app/community/[id]/page.tsx

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  FileText,
  PlayCircle,
  Users,
} from "lucide-react";

import { getCommunity } from "@/lib/communityData";

export default async function CommunityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const community = getCommunity(id);

  if (!community) {
    return (
      <CommunityShell>
        <div className="relative z-10 flex min-h-[calc(100vh-104px)] items-center justify-center p-6">
          <div className="w-full max-w-md rounded-[28px] border border-white/[0.07] bg-[#0a1a16]/70 p-8 text-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.04)] backdrop-blur-2xl">
            <h1 className="text-3xl font-black text-white">
              Community Not Found
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              The community you are trying to access does not exist.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center justify-center rounded-2xl border border-white/[0.08] bg-gradient-to-br from-blue-500/20 to-indigo-500/20 px-5 py-3 text-sm font-semibold text-white transition-all hover:border-white/[0.15]"
            >
              Go Back
            </Link>
          </div>
        </div>
      </CommunityShell>
    );
  }

  const totalLectures = community.subjects.reduce(
    (sum, subject) => sum + subject.lectures,
    0
  );

  return (
    <CommunityShell>
      <div className="relative z-10 p-5 md:p-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-300 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div>
            <div className="inline-flex rounded-2xl border border-white/[0.08] bg-gradient-to-br from-blue-500/20 to-indigo-500/20 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-xl">
              Community
            </div>

            <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[0.95] tracking-tight text-white md:text-7xl">
              {community.name}
            </h1>

            <p className="mt-6 max-w-2xl text-[17px] leading-8 text-slate-300">
              {community.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/community/${community.slug}/dashboard`}
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-black text-black transition hover:scale-[1.02]"
              >
                Open Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={`/community/${community.slug}/dashboard/tools`}
                className="inline-flex items-center rounded-2xl border border-white/[0.08] bg-white/[0.05] px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.09]"
              >
                Exam Tools
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <StatCard
              icon={<Users className="h-4 w-4" />}
              label="Members"
              value={`${community.members}+`}
            />
            <StatCard
              icon={<BookOpen className="h-4 w-4" />}
              label="Subjects"
              value={String(community.subjects.length)}
            />
            <StatCard
              icon={<PlayCircle className="h-4 w-4" />}
              label="Lectures"
              value={String(totalLectures)}
            />
          </div>
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-3">
          <FeatureCard
            icon={<PlayCircle className="h-5 w-5" />}
            title="Video Lectures"
            description="Topic-wise classes organized around the subjects in this community."
            action="Explore Lectures"
          />
          <FeatureCard
            icon={<FileText className="h-5 w-5" />}
            title="Notes & PDFs"
            description="Compact revision notes, handouts, and quick reference sheets."
            action="Open Notes"
            muted
          />
          <FeatureCard
            icon={<BookOpen className="h-5 w-5" />}
            title="MCQs & PYQs"
            description="Practice questions mapped to the same preparation track."
            action="Start Practice"
            muted
          />
        </section>

        <section className="mt-8 rounded-[28px] border border-white/[0.07] bg-[#0a1a16]/60 p-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.04)] backdrop-blur-2xl">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-500">
                Syllabus Track
              </p>
              <h2 className="mt-2 text-2xl font-black text-white">
                Subjects Included
              </h2>
            </div>
            <p className="hidden text-sm text-slate-400 sm:block">
              {totalLectures} lectures planned
            </p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {community.subjects.map((subject) => (
              <div
                key={subject.id}
                className="rounded-2xl border border-white/[0.07] bg-black/20 px-4 py-3"
              >
                <p className="font-semibold text-white">
                  {subject.title}
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  {subject.lectures} lectures
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </CommunityShell>
  );
}

function CommunityShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="pl-[120px] pr-5 py-5">
      <div className="relative min-h-[calc(100vh-40px)] overflow-hidden rounded-[36px] border border-white/[0.06] shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-3xl">
        <div
          className="absolute inset-0 z-0"
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
        <div className="absolute inset-0 backdrop-blur-[1px]" />
        {children}
      </div>
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/[0.07] bg-[#0a1a16]/70 p-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.04)] backdrop-blur-2xl">
      <div className="flex items-center gap-2 text-sm text-slate-400">
        {icon}
        {label}
      </div>
      <p className="mt-3 text-3xl font-black text-white">
        {value}
      </p>
    </div>
  );
}

function FeatureCard({
  action,
  description,
  icon,
  muted = false,
  title,
}: {
  action: string;
  description: string;
  icon: React.ReactNode;
  muted?: boolean;
  title: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-[24px] border border-white/[0.07] bg-[#0a1a16]/60 p-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.04)] backdrop-blur-2xl transition-all hover:-translate-y-1 hover:border-white/[0.12]">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-transparent opacity-0 transition group-hover:opacity-100" />
      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/[0.08] bg-gradient-to-br from-blue-500/20 to-indigo-500/20 text-white">
            {icon}
          </div>
          <h2 className="text-xl font-black text-white">
            {title}
          </h2>
        </div>
        <p className="mt-4 min-h-[48px] text-sm leading-6 text-slate-400">
          {description}
        </p>
        <button
          className={`mt-5 inline-flex w-full items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold transition ${
            muted
              ? "border border-white/[0.08] bg-white/[0.05] text-white hover:bg-white/[0.09]"
              : "bg-emerald-500 text-black hover:scale-[1.01]"
          }`}
          type="button"
        >
          {action}
        </button>
      </div>
    </div>
  );
}
