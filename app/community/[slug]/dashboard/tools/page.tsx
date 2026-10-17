// app/community/[id]/dashboard/tools/page.tsx

import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  RotateCcw,
} from "lucide-react";

import { getCommunity } from "@/lib/communityData";

export default async function ExamToolsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const community = getCommunity(id);

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

        <div className="relative z-10 p-5 md:p-8">
          <Link
            href={`/community/${id}/dashboard`}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-300 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-stretch">
            <div className="rounded-[30px] border border-white/[0.07] bg-[#0a1a16]/60 p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.04)] backdrop-blur-2xl md:p-7">
              <div className="inline-flex rounded-2xl border border-white/[0.08] bg-gradient-to-br from-blue-500/20 to-indigo-500/20 px-5 py-2.5 text-sm font-semibold text-white">
                Productivity Suite
              </div>
              <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight text-white md:text-6xl">
                Exam Tools
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                Smart utilities for age eligibility, study planning, and
                preparation tracking
                {community ? ` in ${community.name}` : ""}.
              </p>
            </div>

            <div className="rounded-[30px] border border-white/[0.07] bg-[#0a1a16]/70 p-6 backdrop-blur-2xl">
              <p className="text-sm text-slate-400">
                Featured Tool
              </p>
              <h2 className="mt-3 text-2xl font-black text-white">
                Age Eligibility Calculator
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Check age criteria for UPSC, PCS, SSC, Banking, Railways,
                and other exams.
              </p>
            </div>
          </section>

          <section className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">
            <div className="rounded-[30px] border border-white/[0.07] bg-[#0a1a16]/60 p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.04)] backdrop-blur-2xl md:p-7">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-gradient-to-br from-blue-500/20 to-indigo-500/20 text-white">
                  <Clock3 className="h-7 w-7" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">
                    Age Eligibility
                  </h2>
                  <p className="mt-1 text-sm text-slate-400">
                    Check your exam eligibility instantly
                  </p>
                </div>
              </div>

              <div className="mt-7 grid gap-5 md:grid-cols-2">
                <Field
                  label="Date of Birth"
                  type="date"
                />
                <SelectField
                  label="Select Exam"
                  options={[
                    "UPSC CSE",
                    "HCS",
                    "UPPCS",
                    "SSC CGL",
                    "Bank PO",
                    "Railways",
                  ]}
                />
                <SelectField
                  label="Category"
                  options={[
                    "General",
                    "OBC",
                    "SC",
                    "ST",
                    "EWS",
                    "PwD",
                  ]}
                />
                <Field
                  label="Cutoff Date"
                  type="date"
                />
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-black text-black transition hover:scale-[1.02]"
                  type="button"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Calculate
                </button>
                <button
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.05] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.09]"
                  type="button"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </button>
              </div>
            </div>

            <div className="rounded-[30px] border border-white/[0.07] bg-[#0a1a16]/60 p-6 backdrop-blur-2xl md:p-7">
              <h2 className="text-3xl font-black leading-tight text-white">
                Smart Eligibility System
              </h2>
              <p className="mt-5 text-sm leading-7 text-slate-300">
                Designed for quick checks before you commit time to an exam
                cycle.
              </p>

              <div className="mt-6 space-y-3">
                <ToolPoint
                  icon={<CalendarDays className="h-4 w-4" />}
                  title="Age Relaxation"
                  text="SC, ST, OBC, EWS, and PwD rule support."
                />
                <ToolPoint
                  icon={<Clock3 className="h-4 w-4" />}
                  title="Official Cutoff Dates"
                  text="Exam-wise age calculation by cutoff date."
                />
                <ToolPoint
                  icon={<CheckCircle2 className="h-4 w-4" />}
                  title="Multiple Exams"
                  text="UPSC, State PCS, SSC, Banking, Railways, and more."
                />
              </div>

              <div className="mt-6 rounded-[24px] border border-emerald-400/20 bg-emerald-500/10 p-5">
                <p className="text-sm text-emerald-200">
                  Eligibility Result
                </p>
                <h3 className="mt-2 text-3xl font-black text-white">
                  Ready to calculate
                </h3>
                <p className="mt-2 text-sm leading-6 text-emerald-100/80">
                  Enter your details to check the selected exam criteria.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  type,
}: {
  label: string;
  type: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-300">
        {label}
      </span>
      <input
        className="w-full rounded-2xl border border-white/[0.08] bg-black/20 px-4 py-3 text-white outline-none transition focus:border-emerald-400/40"
        type={type}
      />
    </label>
  );
}

function SelectField({
  label,
  options,
}: {
  label: string;
  options: string[];
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-300">
        {label}
      </span>
      <select className="w-full rounded-2xl border border-white/[0.08] bg-black/20 px-4 py-3 text-white outline-none transition focus:border-emerald-400/40">
        {options.map((option) => (
          <option key={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function ToolPoint({
  icon,
  text,
  title,
}: {
  icon: React.ReactNode;
  text: string;
  title: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-black/20 px-5 py-4">
      <div className="flex items-center gap-2 font-semibold text-white">
        {icon}
        {title}
      </div>
      <p className="mt-1 text-sm text-slate-400">
        {text}
      </p>
    </div>
  );
}
