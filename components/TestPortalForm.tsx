"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  FileQuestion,
  GraduationCap,
} from "lucide-react";
import TestLauncherModal, {
  type TestLaunchConfig,
} from "@/components/TestLauncherModal";

type TestType = "mcqs" | "pyqs";

type TestPortalOption = {
  exam: string;
  subject: string;
  lectureTitle: string;
  subTitle: string;
};

type TestPortalValues = {
  exam: string;
  subject: string;
  lectureTitle: string;
  subTitle: string;
  type: TestType;
};

interface TestPortalFormProps {
  options: TestPortalOption[];
  initialValues: TestPortalValues;
}

function uniqueValues(values: string[]) {
  return Array.from(
    new Set(values.filter(Boolean))
  ).sort((a, b) => a.localeCompare(b));
}

function includeSelected(
  values: string[],
  selected: string
) {
  if (!selected || values.includes(selected)) {
    return values;
  }

  return [selected, ...values];
}

export default function TestPortalForm({
  options,
  initialValues,
}: TestPortalFormProps) {
  const router = useRouter();
  const [exam, setExam] = useState(
    initialValues.exam
  );
  const [subject, setSubject] = useState(
    initialValues.subject
  );
  const [lectureTitle, setLectureTitle] =
    useState(initialValues.lectureTitle);
  const [subTitle, setSubTitle] = useState(
    initialValues.subTitle
  );
  const [type, setType] = useState<TestType>(
    initialValues.type
  );
  const [launcherOpen, setLauncherOpen] =
    useState(false);
  const [formError, setFormError] =
    useState("");
  const [launchConfig, setLaunchConfig] =
    useState<TestLaunchConfig | null>(null);

  const exams = useMemo(
    () =>
      includeSelected(
        uniqueValues(
          options.map((option) => option.exam)
        ),
        exam
      ),
    [exam, options]
  );

  const subjects = useMemo(
    () =>
      includeSelected(
        uniqueValues(
          options
            .filter(
              (option) =>
                !exam || option.exam === exam
            )
            .map((option) => option.subject)
        ),
        subject
      ),
    [exam, options, subject]
  );

  const lectures = useMemo(
    () =>
      includeSelected(
        uniqueValues(
          options
            .filter(
              (option) =>
                (!exam ||
                  option.exam === exam) &&
                (!subject ||
                  option.subject === subject)
            )
            .map(
              (option) =>
                option.lectureTitle
            )
        ),
        lectureTitle
      ),
    [exam, lectureTitle, options, subject]
  );

  const subTitles = useMemo(
    () =>
      includeSelected(
        uniqueValues(
          options
            .filter(
              (option) =>
                (!exam ||
                  option.exam === exam) &&
                (!subject ||
                  option.subject === subject) &&
                (!lectureTitle ||
                  option.lectureTitle ===
                    lectureTitle)
            )
            .map((option) => option.subTitle)
        ),
        subTitle
      ),
    [
      exam,
      lectureTitle,
      options,
      subTitle,
      subject,
    ]
  );

  const handleExamChange = (
    nextExam: string
  ) => {
    setExam(nextExam);
    setSubject("");
    setLectureTitle("");
    setSubTitle("");
  };

  const handleSubjectChange = (
    nextSubject: string
  ) => {
    setSubject(nextSubject);
    setLectureTitle("");
    setSubTitle("");
  };

  const handleLectureChange = (
    nextLectureTitle: string
  ) => {
    setLectureTitle(nextLectureTitle);
    setSubTitle("");
  };

  const handleSubmit = () => {
    if (
      !exam ||
      !subject ||
      !lectureTitle ||
      !subTitle
    ) {
      setFormError(
        "Select exam, subject, lecture title, and sub title before launching the test."
      );
      return;
    }

    setFormError("");
    setLauncherOpen(true);
  };

  const handleLaunch = (
    config: TestLaunchConfig
  ) => {
    sessionStorage.setItem(
      "pending-test-launch",
      JSON.stringify(config)
    );
    sessionStorage.removeItem(
      "active-test-attempt"
    );
    setLaunchConfig(config);
    setLauncherOpen(false);
    router.push("/test-attempt");
  };

  return (
    <main className="min-h-screen pl-[120px] pr-5 py-5">
      <div
        className="
          relative
          overflow-hidden
          rounded-[36px]
          border
          border-white/[0.06]
          backdrop-blur-3xl
          shadow-[0_20px_80px_rgba(0,0,0,0.45)]
          p-8
        "
      >
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

        <div
          className="
            absolute
            inset-0
            opacity-[0.03]
            mix-blend-soft-light
            pointer-events-none
          "
          style={{
            backgroundImage:
              "url('https://grainy-gradients.vercel.app/noise.svg')",
          }}
        />

        <div className="relative z-10">
          <div className="mb-10">
            <p
              className="
                text-[11px]
                uppercase
                tracking-[0.25em]
                text-slate-500
                mb-3
              "
            >
              AI Powered Test Portal
            </p>

            <h1
              className="
                text-4xl
                md:text-5xl
                font-black
                text-white
                tracking-tight
              "
            >
              Start Your Test
            </h1>
          </div>

          <div
            className="
              relative
              overflow-hidden
              rounded-[32px]
              border
              border-white/[0.07]
              bg-[#0a1a16]/60
              backdrop-blur-2xl
              p-8
              shadow-[inset_0_1px_1px_rgba(255,255,255,0.04)]
            "
          >
            <div
              className="
                absolute
                inset-0
                bg-gradient-to-br
                from-blue-500/10
                via-indigo-500/5
                to-transparent
              "
            />

            <div className="relative z-10">
              <div className="mb-10">
                <p className="mb-4 text-sm font-semibold text-slate-300">
                  Test Type
                </p>

                <div
                  className="
                    relative
                    flex
                    w-fit
                    rounded-2xl
                    border
                    border-white/[0.08]
                    bg-white/[0.04]
                    p-1
                  "
                >
                  <div
                    className={`
                      absolute
                      top-1
                      bottom-1
                      w-1/2
                      rounded-xl
                      bg-gradient-to-r
                      from-blue-500
                      to-indigo-500
                      transition-all
                      duration-300
                      ${
                        type === "mcqs"
                          ? "left-1"
                          : "left-[calc(50%-4px)]"
                      }
                    `}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setType("mcqs")
                    }
                    className="
                      relative
                      z-10
                      flex
                      items-center
                      gap-2
                      rounded-xl
                      px-8
                      py-3
                      text-sm
                      font-bold
                      text-white
                    "
                  >
                    <FileQuestion className="w-4 h-4" />
                    MCQs
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setType("pyqs")
                    }
                    className="
                      relative
                      z-10
                      flex
                      items-center
                      gap-2
                      rounded-xl
                      px-8
                      py-3
                      text-sm
                      font-bold
                      text-white
                    "
                  >
                    <BookOpen className="w-4 h-4" />
                    PYQs
                  </button>
                </div>
              </div>

              <div
                className="
                  grid
                  grid-cols-1
                  gap-6
                  md:grid-cols-2
                "
              >
                <div>
                  <label className="mb-3 block text-sm font-semibold text-slate-300">
                    Exam
                  </label>

                  <div className="relative">
                    <GraduationCap
                      className="
                        absolute
                        left-4
                        top-1/2
                        h-5
                        w-5
                        -translate-y-1/2
                        text-slate-400
                      "
                    />

                    <select
                      value={exam}
                      onChange={(event) =>
                        handleExamChange(
                          event.target.value
                        )
                      }
                      className="
                        w-full
                        rounded-2xl
                        border
                        border-white/[0.08]
                        bg-white/[0.04]
                        py-4
                        pl-12
                        pr-4
                        text-white
                        outline-none
                        backdrop-blur-xl
                        focus:border-blue-500/50
                      "
                    >
                      <option value="">
                        Select Exam
                      </option>
                      {exams.map((item) => (
                        <option
                          key={item}
                          value={item}
                          className="bg-slate-900"
                        >
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-3 block text-sm font-semibold text-slate-300">
                    Subject
                  </label>

                  <select
                    value={subject}
                    onChange={(event) =>
                      handleSubjectChange(
                        event.target.value
                      )
                    }
                    className="
                      w-full
                      rounded-2xl
                      border
                      border-white/[0.08]
                      bg-white/[0.04]
                      px-4
                      py-4
                      text-white
                      outline-none
                      backdrop-blur-xl
                      focus:border-blue-500/50
                    "
                  >
                    <option value="">
                      Select Subject
                    </option>
                    {subjects.map((item) => (
                      <option
                        key={item}
                        value={item}
                        className="bg-slate-900"
                      >
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-3 block text-sm font-semibold text-slate-300">
                    Lecture Title
                  </label>

                  <select
                    value={lectureTitle}
                    onChange={(event) =>
                      handleLectureChange(
                        event.target.value
                      )
                    }
                    className="
                      w-full
                      rounded-2xl
                      border
                      border-white/[0.08]
                      bg-white/[0.04]
                      px-4
                      py-4
                      text-white
                      outline-none
                      backdrop-blur-xl
                      focus:border-blue-500/50
                    "
                  >
                    <option value="">
                      Select Lecture
                    </option>
                    {lectures.map((item) => (
                      <option
                        key={item}
                        value={item}
                        className="bg-slate-900"
                      >
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-3 block text-sm font-semibold text-slate-300">
                    Sub Title
                  </label>

                  <select
                    value={subTitle}
                    onChange={(event) =>
                      setSubTitle(
                        event.target.value
                      )
                    }
                    className="
                      w-full
                      rounded-2xl
                      border
                      border-white/[0.08]
                      bg-white/[0.04]
                      px-4
                      py-4
                      text-white
                      outline-none
                      backdrop-blur-xl
                      focus:border-blue-500/50
                    "
                  >
                    <option value="">
                      Select Sub Title
                    </option>
                    {subTitles.map((item) => (
                      <option
                        key={item}
                        value={item}
                        className="bg-slate-900"
                      >
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-10">
                {formError && (
                  <div
                    role="alert"
                    className="mb-4 rounded-2xl border border-rose-400/25 bg-rose-500/15 px-4 py-3 text-sm font-medium text-rose-100"
                  >
                    {formError}
                  </div>
                )}

                {launchConfig && (
                  <div className="mb-4 rounded-2xl border border-emerald-400/25 bg-emerald-500/15 px-4 py-3 text-sm text-emerald-100">
                    Launcher saved:{" "}
                    {launchConfig.questionCount}{" "}
                    questions for{" "}
                    {launchConfig.scope.subTitle}.
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleSubmit}
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-2xl
                    bg-gradient-to-r
                    from-blue-500
                    to-indigo-500
                    px-8
                    py-4
                    text-lg
                    font-bold
                    text-white
                    shadow-[0_10px_40px_rgba(16,185,129,0.34)]
                    transition-all
                    duration-300
                    hover:scale-[1.02]
                  "
                >
                  <div
                    className="
                      absolute
                      inset-0
                      translate-x-[-100%]
                      bg-gradient-to-r
                      from-transparent
                      via-white/20
                      to-transparent
                      transition-transform
                      duration-1000
                      group-hover:translate-x-[100%]
                    "
                  />

                  <span className="relative z-10">
                    Start Test
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TestLauncherModal
        open={launcherOpen}
        scope={{
          exam,
          subject,
          lectureTitle,
          subTitle,
          type,
        }}
        onClose={() =>
          setLauncherOpen(false)
        }
        onLaunch={handleLaunch}
      />
    </main>
  );
}
