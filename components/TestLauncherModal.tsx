"use client";

import {
  type FormEvent,
  useEffect,
  useId,
  useState,
} from "react";
import { createPortal } from "react-dom";
import {
  AlarmClock,
  ArrowRight,
  CheckCircle2,
  FileQuestion,
  ListChecks,
  Settings2,
  Shuffle,
  X,
} from "lucide-react";

export type TestType = "mcqs" | "pyqs";

export type TestLauncherScope = {
  exam: string;
  subject: string;
  lectureTitle: string;
  subTitle: string;
  type: TestType;
};

export type TestLaunchConfig = {
  scope: TestLauncherScope;
  questionCount: number;
  durationMinutes: number | null;
  difficulty: "mixed" | "easy" | "exam";
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  autoSubmit: boolean;
  showSolutions: boolean;
  negativeMarking: boolean;
  negativeMarks: number;
};

interface TestLauncherModalProps {
  open: boolean;
  scope: TestLauncherScope;
  onClose: () => void;
  onLaunch: (config: TestLaunchConfig) => void;
}

const instructions = [
  "Answer every question before submitting when possible.",
  "A timed test auto-submits only when auto-submit is enabled.",
  "Negative marking applies only when it is enabled for this launch.",
];

export default function TestLauncherModal({
  open,
  scope,
  onClose,
  onLaunch,
}: TestLauncherModalProps) {
  const titleId = useId();
  const [questionCount, setQuestionCount] =
    useState(20);
  const [durationMinutes, setDurationMinutes] =
    useState(30);
  const [untimed, setUntimed] =
    useState(false);
  const [difficulty, setDifficulty] =
    useState<TestLaunchConfig["difficulty"]>(
      "mixed"
    );
  const [
    shuffleQuestions,
    setShuffleQuestions,
  ] = useState(true);
  const [shuffleOptions, setShuffleOptions] =
    useState(true);
  const [autoSubmit, setAutoSubmit] =
    useState(true);
  const [showSolutions, setShowSolutions] =
    useState(true);
  const [negativeMarking, setNegativeMarking] =
    useState(false);
  const [negativeMarks, setNegativeMarks] =
    useState(0.25);
  const [confirmed, setConfirmed] =
    useState(false);

  useEffect(() => {
    if (!open) return;

    const closeOnEscape = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";
    window.addEventListener(
      "keydown",
      closeOnEscape
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;
      window.removeEventListener(
        "keydown",
        closeOnEscape
      );
    };
  }, [onClose, open]);

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!confirmed) return;

    onLaunch({
      scope,
      questionCount,
      durationMinutes: untimed
        ? null
        : durationMinutes,
      difficulty,
      shuffleQuestions,
      shuffleOptions,
      autoSubmit: !untimed && autoSubmit,
      showSolutions,
      negativeMarking,
      negativeMarks: negativeMarking
        ? negativeMarks
        : 0,
    });
  };

  if (!open) return null;

  return createPortal(
    <div
      className="
        fixed
        inset-0
        z-[999999]
        flex
        items-center
        justify-center
        bg-black/80
        px-4
        py-6
        backdrop-blur-md
      "
    >
      <button
        type="button"
        aria-label="Close test launcher"
        className="absolute inset-0"
        onClick={onClose}
      />

      <form
        onSubmit={handleSubmit}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="
          relative
          z-10
          flex
          max-h-[92vh]
          w-full
          max-w-5xl
          flex-col
          overflow-hidden
          rounded-[32px]
          border
          border-white/[0.08]
          bg-[#071713]
          text-white
          shadow-[0_24px_90px_rgba(0,0,0,0.72)]
        "
      >
        <header className="flex items-start gap-4 border-b border-white/[0.08] px-6 py-5">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-blue-300">
              Test Launcher
            </p>
            <h2
              id={titleId}
              className="mt-1 text-2xl font-bold"
            >
              {scope.type.toUpperCase()} setup
            </h2>
          </div>

          <button
            type="button"
            aria-label="Close test launcher"
            onClick={onClose}
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-2xl
              bg-white/[0.06]
              text-white
              transition-all
              hover:bg-white/[0.10]
            "
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="overflow-y-auto p-6">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_360px]">
            <div className="space-y-5">
              <section className="rounded-[24px] border border-white/[0.08] bg-white/[0.04] p-5">
                <div className="mb-4 flex items-center gap-2">
                  <Settings2 className="h-4 w-4 text-blue-300" />
                  <h3 className="font-semibold">
                    Test settings
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm text-slate-300">
                      Questions
                    </span>
                    <input
                      type="number"
                      min={5}
                      max={100}
                      step={5}
                      value={questionCount}
                      onChange={(event) =>
                        setQuestionCount(
                          Math.min(
                            100,
                            Math.max(
                              5,
                              Number(
                                event.target.value
                              ) || 5
                            )
                          )
                        )
                      }
                      className="
                        w-full
                        rounded-2xl
                        border
                        border-white/[0.08]
                        bg-[#0c201a]
                        px-4
                        py-3
                        text-white
                        outline-none
                        focus:border-blue-400/50
                      "
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm text-slate-300">
                      Duration
                    </span>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min={5}
                        max={240}
                        step={5}
                        value={durationMinutes}
                        disabled={untimed}
                        onChange={(event) =>
                          setDurationMinutes(
                            Math.min(
                              240,
                              Math.max(
                                5,
                                Number(
                                  event.target.value
                                ) || 5
                              )
                            )
                          )
                        }
                        className="
                          min-w-0
                          flex-1
                          rounded-2xl
                          border
                          border-white/[0.08]
                          bg-[#0c201a]
                          px-4
                          py-3
                          text-white
                          outline-none
                          disabled:opacity-40
                          focus:border-blue-400/50
                        "
                      />
                      <button
                        type="button"
                        aria-pressed={untimed}
                        onClick={() =>
                          setUntimed(
                            (current) => !current
                          )
                        }
                        className={`
                          rounded-2xl
                          border
                          px-3
                          text-sm
                          font-semibold
                          transition-all
                          ${
                            untimed
                              ? "border-blue-400/40 bg-blue-500/20 text-white"
                              : "border-white/[0.08] bg-white/[0.04] text-slate-300"
                          }
                        `}
                      >
                        Untimed
                      </button>
                    </div>
                  </label>
                </div>

                <fieldset className="mt-5">
                  <legend className="mb-2 text-sm text-slate-300">
                    Difficulty
                  </legend>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      ["mixed", "Mixed"],
                      ["easy", "Revision"],
                      ["exam", "Exam"],
                    ].map(([value, label]) => (
                      <label
                        key={value}
                        className={`
                          cursor-pointer
                          rounded-2xl
                          border
                          px-3
                          py-3
                          text-center
                          text-sm
                          font-semibold
                          transition-all
                          ${
                            difficulty === value
                              ? "border-blue-400/40 bg-blue-500/20"
                              : "border-white/[0.08] bg-white/[0.03] text-slate-300"
                          }
                        `}
                      >
                        <input
                          type="radio"
                          value={value}
                          checked={
                            difficulty === value
                          }
                          onChange={() =>
                            setDifficulty(
                              value as TestLaunchConfig["difficulty"]
                            )
                          }
                          className="sr-only"
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </fieldset>
              </section>

              <section className="rounded-[24px] border border-white/[0.08] bg-white/[0.04] p-5">
                <div className="mb-4 flex items-center gap-2">
                  <Shuffle className="h-4 w-4 text-cyan-300" />
                  <h3 className="font-semibold">
                    Attempt behavior
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Toggle
                    checked={shuffleQuestions}
                    label="Shuffle questions"
                    onChange={setShuffleQuestions}
                  />
                  <Toggle
                    checked={shuffleOptions}
                    label="Shuffle options"
                    onChange={setShuffleOptions}
                  />
                  <Toggle
                    checked={autoSubmit}
                    disabled={untimed}
                    label="Auto-submit timer"
                    onChange={setAutoSubmit}
                  />
                  <Toggle
                    checked={showSolutions}
                    label="Show solutions after test"
                    onChange={setShowSolutions}
                  />
                </div>

                <div className="mt-3 rounded-2xl border border-white/[0.08] bg-[#0c201a] p-4">
                  <Toggle
                    checked={negativeMarking}
                    label="Enable negative marking"
                    onChange={setNegativeMarking}
                  />

                  {negativeMarking && (
                    <label className="mt-3 block">
                      <span className="mb-2 block text-sm text-slate-300">
                        Marks deducted per wrong answer
                      </span>
                      <input
                        type="number"
                        min={0}
                        max={5}
                        step={0.25}
                        value={negativeMarks}
                        onChange={(event) =>
                          setNegativeMarks(
                            Math.min(
                              5,
                              Math.max(
                                0,
                                Number(
                                  event.target.value
                                ) || 0
                              )
                            )
                          )
                        }
                        className="
                          w-full
                          rounded-2xl
                          border
                          border-white/[0.08]
                          bg-white/[0.04]
                          px-4
                          py-3
                          text-white
                          outline-none
                          focus:border-blue-400/50
                        "
                      />
                    </label>
                  )}
                </div>
              </section>
            </div>

            <aside className="space-y-5">
              <section className="rounded-[24px] border border-white/[0.08] bg-white/[0.04] p-5">
                <div className="mb-4 flex items-center gap-2">
                  <FileQuestion className="h-4 w-4 text-emerald-300" />
                  <h3 className="font-semibold">
                    Selected scope
                  </h3>
                </div>

                <Summary label="Exam" value={scope.exam} />
                <Summary
                  label="Subject"
                  value={scope.subject}
                />
                <Summary
                  label="Lecture"
                  value={scope.lectureTitle}
                />
                <Summary
                  label="Sub title"
                  value={scope.subTitle}
                />
              </section>

              <section className="rounded-[24px] border border-white/[0.08] bg-white/[0.04] p-5">
                <div className="mb-4 flex items-center gap-2">
                  <ListChecks className="h-4 w-4 text-amber-300" />
                  <h3 className="font-semibold">
                    Before launch
                  </h3>
                </div>

                <ul className="space-y-3 text-sm text-slate-300">
                  {instructions.map((instruction) => (
                    <li
                      key={instruction}
                      className="flex gap-2"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ul>

                <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-2xl border border-white/[0.08] bg-[#0c201a] p-4">
                  <input
                    type="checkbox"
                    checked={confirmed}
                    onChange={(event) =>
                      setConfirmed(
                        event.target.checked
                      )
                    }
                    className="mt-1 h-4 w-4 accent-blue-500"
                  />
                  <span className="text-sm text-slate-200">
                    I checked the scope and launcher
                    settings.
                  </span>
                </label>
              </section>
            </aside>
          </div>
        </div>

        <footer className="flex flex-col gap-3 border-t border-white/[0.08] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <AlarmClock className="h-4 w-4 text-blue-300" />
            {untimed
              ? "Untimed practice"
              : `${durationMinutes} minute timed test`}
          </div>

          <div className="flex flex-wrap justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.04] px-5 py-3 font-semibold text-slate-200 hover:bg-white/[0.08]"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={!confirmed}
              className="
                flex
                items-center
                gap-2
                rounded-2xl
                bg-gradient-to-r
                from-blue-500
                to-indigo-500
                px-5
                py-3
                font-bold
                text-white
                shadow-[0_10px_35px_rgba(16,185,129,0.28)]
                transition-all
                hover:brightness-110
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              Launch Test
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </footer>
      </form>
    </div>,
    document.body
  );
}

function Summary({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border-t border-white/[0.06] py-3 first:border-t-0 first:pt-0">
      <div className="text-xs font-semibold uppercase text-slate-400">
        {label}
      </div>
      <div className="mt-1 break-words font-semibold text-white">
        {value}
      </div>
    </div>
  );
}

function Toggle({
  checked,
  disabled = false,
  label,
  onChange,
}: {
  checked: boolean;
  disabled?: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label
      className={`
        flex
        min-h-14
        cursor-pointer
        items-center
        justify-between
        gap-3
        rounded-2xl
        border
        border-white/[0.08]
        bg-[#0c201a]
        px-4
        py-3
        text-sm
        font-medium
        ${disabled ? "opacity-40" : ""}
      `}
    >
      <span>{label}</span>
      <span
        className={`
          relative
          h-6
          w-11
          shrink-0
          rounded-full
          transition-colors
          ${
            checked
              ? "bg-blue-500"
              : "bg-white/[0.14]"
          }
        `}
      >
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(event) =>
            onChange(event.target.checked)
          }
          className="sr-only"
        />
        <span
          className={`
            absolute
            top-1
            h-4
            w-4
            rounded-full
            bg-white
            transition-transform
            ${
              checked
                ? "translate-x-6"
                : "translate-x-1"
            }
          `}
        />
      </span>
    </label>
  );
}
