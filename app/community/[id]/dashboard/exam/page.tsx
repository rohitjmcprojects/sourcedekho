// app/community/[id]/dashboard/exam-tools/page.tsx

import Link from "next/link";

import {
  ArrowLeft,
  Clock3,
} from "lucide-react";

export default async function ExamToolsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

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
          href={`/community/${id}/dashboard`}
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
          Back to Dashboard
        </Link>

        {/* HERO */}
        <div
          className="
            mt-4
            overflow-hidden
            rounded-[30px]
            border
            border-white/10
            bg-gradient-to-br
            from-emerald-500/10
            via-white/5
            to-transparent
            p-6
            md:p-8
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
            <div className="max-w-2xl">
              <span
                className="
                  inline-flex
                  rounded-full
                  border
                  border-emerald-500/20
                  bg-emerald-500/10
                  px-4
                  py-1
                  text-xs
                  font-medium
                  text-emerald-300
                "
              >
                Productivity Suite
              </span>

              <h1
                className="
                  mt-4
                  text-4xl
                  md:text-6xl
                  font-bold
                  leading-tight
                "
              >
                Exam Tools
              </h1>

              <p
                className="
                  mt-5
                  text-base
                  leading-7
                  text-slate-300
                "
              >
                Smart utilities designed for serious
                competitive exam aspirants.
              </p>
            </div>

            {/* RIGHT */}
            <div
              className="
                rounded-[26px]
                border
                border-white/10
                bg-black/20
                p-6
                backdrop-blur-xl
                min-w-[260px]
              "
            >
              <p className="text-sm text-slate-400">
                Featured Tool
              </p>

              <h2 className="mt-3 text-2xl font-bold">
                Age Eligibility Calculator
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Instantly calculate your eligibility
                for UPSC, PCS, SSC, Banking, Railways,
                and other exams.
              </p>
            </div>
          </div>
        </div>

        {/* AGE ELIGIBILITY TOOL */}
        <div
          className="
            mt-6
            grid
            gap-5
            lg:grid-cols-2
          "
        >
          {/* CALCULATOR CARD */}
          <div
            className="
              rounded-[30px]
              border
              border-white/10
              bg-white/5
              p-6
              md:p-7
              backdrop-blur-xl
            "
          >
            <div className="flex items-center gap-4">
              <div
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  bg-emerald-500/10
                  text-emerald-400
                "
              >
                <Clock3 className="w-7 h-7" />
              </div>

              <div>
                <h2 className="text-2xl font-bold">
                  Age Eligibility Calculator
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Check your exam eligibility instantly
                </p>
              </div>
            </div>

            <p
              className="
                mt-6
                text-sm
                leading-7
                text-slate-400
              "
            >
              Calculate your exact age for UPSC,
              HCS, UPPCS, SSC, Banking, Railways,
              and other competitive exams according
              to official cutoff dates.
            </p>

            {/* FORM */}
            <div className="mt-8 space-y-5">
              {/* DOB */}
              <div>
                <label
                  className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-slate-300
                  "
                >
                  Date of Birth
                </label>

                <input
                  type="date"
                  className="
                    w-full
                    rounded-2xl
                    border
                    border-white/10
                    bg-black/20
                    px-4
                    py-3
                    text-white
                    outline-none
                  "
                />
              </div>

              {/* EXAM */}
              <div>
                <label
                  className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-slate-300
                  "
                >
                  Select Exam
                </label>

                <select
                  className="
                    w-full
                    rounded-2xl
                    border
                    border-white/10
                    bg-black/20
                    px-4
                    py-3
                    text-white
                    outline-none
                  "
                >
                  <option>UPSC CSE</option>
                  <option>HCS</option>
                  <option>UPPCS</option>
                  <option>SSC CGL</option>
                  <option>Bank PO</option>
                  <option>Railways</option>
                </select>
              </div>

              {/* CATEGORY */}
              <div>
                <label
                  className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-slate-300
                  "
                >
                  Category
                </label>

                <select
                  className="
                    w-full
                    rounded-2xl
                    border
                    border-white/10
                    bg-black/20
                    px-4
                    py-3
                    text-white
                    outline-none
                  "
                >
                  <option>General</option>
                  <option>OBC</option>
                  <option>SC</option>
                  <option>ST</option>
                  <option>EWS</option>
                  <option>PwD</option>
                </select>
              </div>
            </div>

            {/* BUTTONS */}
            <div
              className="
                mt-8
                flex
                flex-wrap
                gap-4
              "
            >
              <button
                className="
                  rounded-xl
                  bg-emerald-500
                  px-5
                  py-3
                  text-sm
                  font-semibold
                  text-black
                  transition
                  hover:scale-[1.02]
                "
              >
                Calculate Eligibility
              </button>

              <button
                className="
                  rounded-xl
                  border
                  border-white/10
                  bg-white/5
                  px-5
                  py-3
                  text-sm
                  font-medium
                  text-white
                  transition
                  hover:bg-white/10
                "
              >
                Reset
              </button>
            </div>
          </div>

          {/* INFO PANEL */}
          <div
            className="
              rounded-[30px]
              border
              border-white/10
              bg-gradient-to-br
              from-emerald-500/10
              via-white/5
              to-transparent
              p-6
              md:p-7
              backdrop-blur-xl
            "
          >
            <h2
              className="
                text-3xl
                font-bold
                leading-tight
              "
            >
              Smart Eligibility System
            </h2>

            <p
              className="
                mt-5
                text-sm
                leading-7
                text-slate-300
              "
            >
              Automatically calculate eligibility
              using official rules and category-wise
              relaxations.
            </p>

            <div
              className="
                mt-6
                space-y-4
              "
            >
              {/* ITEM */}
              <div
                className="
                  rounded-2xl
                  border
                  border-white/10
                  bg-black/20
                  px-5
                  py-4
                "
              >
                <p className="font-medium">
                  ✔ Age Relaxation
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  SC / ST / OBC / EWS / PwD rules
                </p>
              </div>

              {/* ITEM */}
              <div
                className="
                  rounded-2xl
                  border
                  border-white/10
                  bg-black/20
                  px-5
                  py-4
                "
              >
                <p className="font-medium">
                  ✔ Official Cutoff Dates
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  Exam-wise accurate age calculation
                </p>
              </div>

              {/* ITEM */}
              <div
                className="
                  rounded-2xl
                  border
                  border-white/10
                  bg-black/20
                  px-5
                  py-4
                "
              >
                <p className="font-medium">
                  ✔ Multiple Exams
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  UPSC, State PCS, SSC, Banking &
                  more
                </p>
              </div>

              {/* RESULT */}
              <div
                className="
                  rounded-[26px]
                  border
                  border-emerald-500/20
                  bg-emerald-500/10
                  p-5
                "
              >
                <p className="text-sm text-emerald-200">
                  Eligibility Result
                </p>

                <h3 className="mt-2 text-3xl font-bold">
                  Eligible
                </h3>

                <p className="mt-2 text-sm text-emerald-100/80">
                  You satisfy the current age
                  criteria for the selected exam.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}