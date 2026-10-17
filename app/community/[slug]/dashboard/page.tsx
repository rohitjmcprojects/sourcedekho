// app/community/[id]/dashboard/page.tsx

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Clock3,
  FileText,
  GraduationCap,
  MessagesSquare,
  Users,
} from "lucide-react";

import { getCommunity } from "@/lib/communityData";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const dashboard = getCommunity(id);

  if (!dashboard) {
    return (
      <DashboardShell>
        <div className="relative z-10 flex min-h-[calc(100vh-104px)] items-center justify-center p-6">
          <div className="w-full max-w-md rounded-[28px] border border-white/[0.07] bg-[#0a1a16]/70 p-8 text-center backdrop-blur-2xl">
            <h1 className="text-3xl font-black text-white">
              Dashboard Not Found
            </h1>
            <p className="mt-4 text-sm text-slate-400">
              This dashboard does not exist.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center justify-center rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-black text-black"
            >
              Go Home
            </Link>
          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="relative z-10 p-5 md:p-8">
        <Link
          href={`/community/${dashboard.slug}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-300 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Community
        </Link>

        <section className="mt-6 rounded-[30px] border border-white/[0.07] bg-[#0a1a16]/60 p-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.04)] backdrop-blur-2xl md:p-6">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-center">
            <div>
              <div className="inline-flex rounded-2xl border border-white/[0.08] bg-gradient-to-br from-blue-500/20 to-indigo-500/20 px-5 py-2.5 text-sm font-semibold text-white">
                Dashboard
              </div>
              <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight text-white md:text-6xl">
                {dashboard.name}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                Continue your preparation journey with structured posts,
                strategy updates, tools, and subject-wise study flow.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <MiniStat
                icon={<Users className="h-4 w-4" />}
                label="Members"
                value={`${dashboard.members}+`}
              />
              <MiniStat
                icon={<GraduationCap className="h-4 w-4" />}
                label="Progress"
                value={`${dashboard.progress}%`}
              />
            </div>
          </div>

          <div className="mt-7">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-slate-300">
                Course Progress
              </p>
              <p className="text-sm font-semibold text-white">
                {dashboard.progress}%
              </p>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/[0.08]">
              <div
                className="h-full rounded-full bg-emerald-500"
                style={{
                  width: `${dashboard.progress}%`,
                }}
              />
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-3">
          <DashboardFeature
            action="Open Posts"
            description="Read important notices, topper strategies, discussion threads, and current affairs updates."
            href="#"
            icon={<MessagesSquare className="h-5 w-5" />}
            title="Community Posts"
          />
          <DashboardFeature
            action="View Strategies"
            description="Follow preparation roadmaps, weekly plans, revision cycles, and exam strategy notes."
            href="#"
            icon={<FileText className="h-5 w-5" />}
            title="Prep Strategy"
            muted
          />
          <DashboardFeature
            action="Open Tools"
            description="Use timers, syllabus trackers, eligibility utilities, planners, and productivity helpers."
            href={`/community/${dashboard.slug}/dashboard/tools`}
            icon={<Clock3 className="h-5 w-5" />}
            title="Exam Tools"
            muted
          />
        </section>

        <section className="mt-6 rounded-[28px] border border-white/[0.07] bg-[#0a1a16]/60 p-5 backdrop-blur-2xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-500">
                Active Subjects
              </p>
              <h2 className="mt-2 text-2xl font-black text-white">
                Today&apos;s Study Board
              </h2>
            </div>
            <Link
              href={`/community/${dashboard.slug}`}
              className="hidden items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-white sm:inline-flex"
            >
              View Community
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {dashboard.subjects.map((subject) => (
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
    </DashboardShell>
  );
}

function DashboardShell({
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

function MiniStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/[0.07] bg-black/20 p-5">
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

function DashboardFeature({
  action,
  description,
  href,
  icon,
  muted = false,
  title,
}: {
  action: string;
  description: string;
  href: string;
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
          <div>
            <h2 className="text-xl font-black text-white">
              {title}
            </h2>
            <p className="text-sm text-slate-500">
              Community module
            </p>
          </div>
        </div>
        <p className="mt-5 min-h-[72px] text-sm leading-6 text-slate-400">
          {description}
        </p>
        <Link
          href={href}
          className={`mt-5 inline-flex w-full items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold transition ${
            muted
              ? "border border-white/[0.08] bg-white/[0.05] text-white hover:bg-white/[0.09]"
              : "bg-emerald-500 text-black hover:scale-[1.01]"
          }`}
        >
          {action}
        </Link>
      </div>
    </div>
  );
}
