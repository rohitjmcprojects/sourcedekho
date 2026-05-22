"use client";

import { useRouter } from "next/navigation";
import {
  type FormEvent,
  useEffect,
  useId,
  useState,
} from "react";
import { createPortal } from "react-dom";
import {
  ArrowRight,
  BookOpen,
  FileQuestion,
  X,
} from "lucide-react";

type TestType = "mcqs" | "pyqs";

interface LectureTestModalProps {
  exam: string;
  subject: string;
  lectureTitle: string;
  subTitles?: string[];
  type: TestType;
  locked?: boolean;
}

export default function LectureTestModal({
  exam,
  subject,
  lectureTitle,
  subTitles = [],
  type,
  locked = false,
}: LectureTestModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedSubTitle, setSelectedSubTitle] =
    useState(subTitles[0] || "");
  const titleId = useId();

  const label =
    type === "mcqs" ? "MCQs" : "PYQs";

  const Icon =
    type === "mcqs"
      ? FileQuestion
      : BookOpen;

  useEffect(() => {
    if (!open) return;

    const closeOnEscape = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        setOpen(false);
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
  }, [open]);

  const buildTestHref = (
    subTitle: string
  ) => {
    const query =
      new URLSearchParams({
        exam,
        subject,
        lecture_title: lectureTitle,
        sub_title: subTitle,
        type,
      });

    return `/test-portal?${query.toString()}`;
  };

  const openModal = () => {
    if (locked) return;

    setSelectedSubTitle(
      (currentSubTitle) =>
        currentSubTitle ||
        subTitles[0] ||
        ""
    );
    setOpen(true);
  };

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!selectedSubTitle) return;

    setOpen(false);
    router.push(
      buildTestHref(selectedSubTitle)
    );
  };

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        disabled={locked}
        className={`
          group
          flex
          items-center
          gap-2.5
          px-4
          py-3
          rounded-2xl
          border
          border-white/[0.08]
          bg-white/[0.04]
          backdrop-blur-xl
          text-slate-200
          text-sm
          font-semibold
          transition-all
          duration-300
          ${locked ? "cursor-not-allowed bg-white/[0.02] text-slate-500 border-white/[0.04]" : "hover:bg-white/[0.08] hover:border-white/[0.12]"}
        `}
      >
        {locked ? (
          <span className="inline-flex items-center gap-2">
            🔒 {label}
          </span>
        ) : (
          <>
            <Icon className="h-4 w-4" />
            {label}
          </>
        )}
      </button>

      {open &&
        createPortal(
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
              aria-label={`Close ${label} modal`}
              className="absolute inset-0"
              onClick={() => setOpen(false)}
            />

            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              className="
                relative
                z-10
                flex
                max-h-[min(720px,92vh)]
                w-full
                max-w-3xl
                flex-col
                overflow-hidden
                rounded-[32px]
                border
                border-white/[0.08]
                bg-[#071713]
                shadow-[0_20px_80px_rgba(0,0,0,0.7)]
              "
            >
              <header
                className="
                  flex
                  items-start
                  gap-4
                  border-b
                  border-white/[0.08]
                  px-6
                  py-5
                "
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-blue-300">
                    {label} Test
                  </p>

                  <h2
                    id={titleId}
                    className="mt-1 break-words text-2xl font-bold text-white"
                  >
                    {lectureTitle}
                  </h2>
                </div>

                <button
                  type="button"
                  aria-label={`Close ${label} modal`}
                  onClick={() => setOpen(false)}
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

              <form
                onSubmit={handleSubmit}
                className="overflow-y-auto p-6"
              >
                <dl
                  className="
                    grid
                    grid-cols-1
                    gap-3
                    sm:grid-cols-2
                  "
                >
                  <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4">
                    <dt className="text-xs font-semibold uppercase text-slate-400">
                      Exam
                    </dt>
                    <dd className="mt-2 break-words text-base font-semibold text-white">
                      {exam}
                    </dd>
                  </div>

                  <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4">
                    <dt className="text-xs font-semibold uppercase text-slate-400">
                      Subject
                    </dt>
                    <dd className="mt-2 break-words text-base font-semibold text-white">
                      {subject}
                    </dd>
                  </div>

                  <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 sm:col-span-2">
                    <dt className="text-xs font-semibold uppercase text-slate-400">
                      Lecture Title
                    </dt>
                    <dd className="mt-2 break-words text-base font-semibold text-white">
                      {lectureTitle}
                    </dd>
                  </div>
                </dl>

                <div className="mt-6">
                  <label
                    htmlFor={`${titleId}-subtitle`}
                    className="text-sm font-semibold uppercase text-slate-400"
                  >
                    Sub Title
                  </label>

                  <div className="mt-3">
                    {subTitles.length > 0 ? (
                      <select
                        id={`${titleId}-subtitle`}
                        value={selectedSubTitle}
                        onChange={(event) =>
                          setSelectedSubTitle(
                            event.target.value
                          )
                        }
                        required
                        className="
                          w-full
                          rounded-2xl
                          border
                          border-white/[0.08]
                          bg-white/[0.04]
                          px-4
                          py-4
                          font-medium
                          text-white
                          outline-none
                          transition-all
                          focus:border-blue-400/50
                        "
                      >
                        {subTitles.map(
                          (subTitle) => (
                            <option
                              key={subTitle}
                              value={subTitle}
                              className="bg-slate-900"
                            >
                              {subTitle}
                            </option>
                          )
                        )}
                      </select>
                    ) : (
                      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-slate-300">
                        No sub titles available.
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="submit"
                    disabled={!selectedSubTitle}
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
                      font-semibold
                      text-white
                      shadow-[0_10px_35px_rgba(16,185,129,0.28)]
                      transition-all
                      hover:brightness-110
                      disabled:cursor-not-allowed
                      disabled:opacity-40
                    "
                  >
                    Continue to Test Portal
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </section>
          </div>,
          document.body
        )}
    </>
  );
}
