"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  type FormEvent,
  useEffect,
  useState,
} from "react";
import {
  AlarmClock,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileQuestion,
  Flag,
  RotateCcw,
  Send,
  X,
} from "lucide-react";
import type { TestLaunchConfig } from "@/components/TestLauncherModal";
import {
  prepareAttemptQuestions,
  type AttemptQuestion,
} from "@/lib/testQuestions";

type AnswerMap = Record<string, string>;

type StoredAttempt = {
  fingerprint: string;
  answers: AnswerMap;
  reviewIds: string[];
  currentQuestionId: string;
  deadline: number | null;
  questions: AttemptQuestion[];
};

type AttemptResult = {
  correct: number;
  wrong: number;
  skipped: number;
  score: number;
  maxScore: number;
};

const launchKey = "pending-test-launch";
const attemptKey = "active-test-attempt";

function readLaunchConfig() {
  const storedLaunch =
    sessionStorage.getItem(launchKey);

  if (!storedLaunch) return null;

  try {
    return JSON.parse(
      storedLaunch
    ) as TestLaunchConfig;
  } catch {
    return null;
  }
}

function fingerprintLaunch(
  config: TestLaunchConfig
) {
  return JSON.stringify(config);
}

function formatClock(totalSeconds: number) {
  const safeSeconds = Math.max(
    0,
    totalSeconds
  );
  const hours = Math.floor(
    safeSeconds / 3600
  );
  const minutes = Math.floor(
    (safeSeconds % 3600) / 60
  );
  const seconds = safeSeconds % 60;

  return hours > 0
    ? `${hours}:${String(minutes).padStart(
        2,
        "0"
      )}:${String(seconds).padStart(2, "0")}`
    : `${minutes}:${String(seconds).padStart(
        2,
        "0"
      )}`;
}

function calculateResult(
  questions: AttemptQuestion[],
  answers: AnswerMap,
  config: TestLaunchConfig
) {
  return questions.reduce<AttemptResult>(
    (result, question) => {
      const answer = answers[question.id];

      if (!answer) {
        result.skipped += 1;
        return result;
      }

      if (
        answer === question.correctOptionId
      ) {
        result.correct += 1;
        result.score += question.marks;
        return result;
      }

      result.wrong += 1;
      result.score -=
        config.negativeMarking
          ? config.negativeMarks
          : 0;
      return result;
    },
    {
      correct: 0,
      wrong: 0,
      skipped: 0,
      score: 0,
      maxScore: questions.reduce(
        (score, question) =>
          score + question.marks,
        0
      ),
    }
  );
}

type QuestionApiResponse = {
  questions?: AttemptQuestion[];
  error?: string;
};

async function requestQuestions(
  config: TestLaunchConfig
) {
  const response = await fetch(
    "/api/test-questions",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        scope: config.scope,
        questionCount:
          config.questionCount,
        difficulty: config.difficulty,
      }),
    }
  );

  const data =
    (await response.json()) as QuestionApiResponse;

  if (!response.ok) {
    throw new Error(
      data.error ||
        "Questions could not be loaded."
    );
  }

  return prepareAttemptQuestions(
    data.questions || [],
    config
  );
}

export default function TestAttemptRunner() {
  const router = useRouter();
  const [config, setConfig] =
    useState<TestLaunchConfig | null>(null);
  const [questions, setQuestions] =
    useState<AttemptQuestion[]>([]);
  const [
    questionsLoading,
    setQuestionsLoading,
  ] = useState(true);
  const [questionsError, setQuestionsError] =
    useState("");
  const [answers, setAnswers] =
    useState<AnswerMap>({});
  const [reviewIds, setReviewIds] =
    useState<string[]>([]);
  const [
    currentQuestionId,
    setCurrentQuestionId,
  ] = useState("");
  const [deadline, setDeadline] =
    useState<number | null>(null);
  const [remainingSeconds, setRemainingSeconds] =
    useState<number | null>(null);
  const [submitOpen, setSubmitOpen] =
    useState(false);
  const [result, setResult] =
    useState<AttemptResult | null>(null);
  const [expired, setExpired] =
    useState(false);

  const fingerprint = config
    ? fingerprintLaunch(config)
    : "";

  useEffect(() => {
    let active = true;

    const frame = window.requestAnimationFrame(
      () => {
        const nextConfig = readLaunchConfig();

        if (!nextConfig) {
          setQuestionsLoading(false);
          return;
        }

        const storedAttempt =
          sessionStorage.getItem(attemptKey);
        const nextFingerprint =
          fingerprintLaunch(nextConfig);

        setConfig(nextConfig);

        if (storedAttempt) {
          try {
            const attempt = JSON.parse(
              storedAttempt
            ) as StoredAttempt;

            if (
              attempt.fingerprint ===
              nextFingerprint
            ) {
              const restoredQuestions =
                attempt.questions || [];

              setAnswers(attempt.answers);
              setReviewIds(
                attempt.reviewIds
              );
              setQuestions(
                restoredQuestions
              );
              setCurrentQuestionId(
                attempt.currentQuestionId ||
                  restoredQuestions[0]?.id ||
                  ""
              );
              setDeadline(
                attempt.deadline
              );
              setQuestionsLoading(false);
              return;
            }
          } catch {
            sessionStorage.removeItem(
              attemptKey
            );
          }
        }

        void requestQuestions(nextConfig)
          .then((nextQuestions) => {
            if (!active) return;

            setQuestions(nextQuestions);
            setCurrentQuestionId(
              nextQuestions[0]?.id || ""
            );
            setDeadline(
              nextConfig.durationMinutes
                ? Date.now() +
                    nextConfig.durationMinutes *
                      60 *
                      1000
                : null
            );
            setQuestionsLoading(false);
          })
          .catch((error: unknown) => {
            if (!active) return;

            setQuestionsError(
              error instanceof Error
                ? error.message
                : "Questions could not be loaded."
            );
            setQuestionsLoading(false);
          });
      }
    );

    return () => {
      active = false;
      window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (
      !config ||
      !currentQuestionId ||
      result
    ) {
      return;
    }

    const storedAttempt: StoredAttempt = {
      fingerprint,
      answers,
      reviewIds,
      currentQuestionId,
      deadline,
      questions,
    };

    sessionStorage.setItem(
      attemptKey,
      JSON.stringify(storedAttempt)
    );
  }, [
    answers,
    config,
    currentQuestionId,
    deadline,
    fingerprint,
    questions,
    result,
    reviewIds,
  ]);

  useEffect(() => {
    if (!config || !deadline || result) {
      return;
    }

    const tick = () => {
      const nextRemaining = Math.ceil(
        (deadline - Date.now()) / 1000
      );

      setRemainingSeconds(
        Math.max(0, nextRemaining)
      );

      if (nextRemaining > 0) return;

      setExpired(true);

      if (config.autoSubmit) {
        setResult(
          calculateResult(
            questions,
            answers,
            config
          )
        );
        sessionStorage.removeItem(attemptKey);
      }
    };

    tick();
    const interval = window.setInterval(
      tick,
      1000
    );

    return () =>
      window.clearInterval(interval);
  }, [
    answers,
    config,
    deadline,
    questions,
    result,
  ]);

  const currentIndex = questions.findIndex(
    (question) =>
      question.id === currentQuestionId
  );
  const currentQuestion =
    questions[currentIndex];
  const answeredCount =
    Object.keys(answers).length;
  const reviewSet = new Set(reviewIds);

  const submitAttempt = (
    event?: FormEvent
  ) => {
    event?.preventDefault();

    if (!config) return;

    setResult(
      calculateResult(
        questions,
        answers,
        config
      )
    );
    setSubmitOpen(false);
    sessionStorage.removeItem(attemptKey);
  };

  const selectAnswer = (
    optionId: string
  ) => {
    if (!currentQuestion || result) return;

    setAnswers((currentAnswers) => ({
      ...currentAnswers,
      [currentQuestion.id]: optionId,
    }));
  };

  const clearAnswer = () => {
    if (!currentQuestion) return;

    setAnswers((currentAnswers) => {
      const nextAnswers = {
        ...currentAnswers,
      };

      delete nextAnswers[currentQuestion.id];
      return nextAnswers;
    });
  };

  const toggleReview = () => {
    if (!currentQuestion) return;

    setReviewIds((currentIds) =>
      currentIds.includes(
        currentQuestion.id
      )
        ? currentIds.filter(
            (id) =>
              id !== currentQuestion.id
          )
        : [
            ...currentIds,
            currentQuestion.id,
          ]
    );
  };

  const leaveAttempt = () => {
    sessionStorage.removeItem(attemptKey);
    sessionStorage.removeItem(launchKey);
    router.push("/test-portal");
  };

  if (!config) {
    return (
      <main className="min-h-screen pl-[120px] pr-5 py-5">
        <div className="rounded-[36px] border border-white/[0.08] bg-[#0a1a16]/80 p-8 text-white">
          <h1 className="text-3xl font-bold">
            No test launch found
          </h1>
          <p className="mt-3 max-w-2xl text-slate-300">
            Open the test portal, choose a scope,
            and launch an attempt first.
          </p>
          <Link
            href="/test-portal"
            className="mt-6 inline-flex rounded-2xl bg-blue-500 px-5 py-3 font-semibold text-white"
          >
            Go to Test Portal
          </Link>
        </div>
      </main>
    );
  }

  if (questionsLoading) {
    return (
      <AttemptMessage
        title="Loading questions"
        description="Fetching the selected question set from the question bank."
      />
    );
  }

  if (questionsError) {
    return (
      <AttemptMessage
        title="Question load failed"
        description={questionsError}
      />
    );
  }

  if (questions.length === 0) {
    return (
      <AttemptMessage
        title="No questions found"
        description="Add active questions for this exam, subject, lecture, sub title, and test type, then launch again."
      />
    );
  }

  if (result) {
    return (
      <ResultView
        answers={answers}
        config={config}
        questions={questions}
        result={result}
        onExit={leaveAttempt}
      />
    );
  }

  return (
    <main className="min-h-screen pl-[120px] pr-5 py-5 text-white">
      <div className="relative overflow-hidden rounded-[36px] border border-white/[0.06] bg-[#071713] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_30rem)]" />

        <div className="relative z-10">
          <header className="mb-4 flex flex-col gap-4 border-b border-white/[0.08] pb-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-blue-300">
                {config.scope.type.toUpperCase()} attempt
              </p>
              <h1 className="mt-1 break-words text-2xl font-bold">
                {config.scope.subTitle}
              </h1>
              <p className="mt-1 text-sm text-slate-300">
                {config.scope.exam} /{" "}
                {config.scope.subject} /{" "}
                {config.scope.lectureTitle}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <StatusPill
                icon={FileQuestion}
                label={`${answeredCount}/${questions.length} answered`}
              />
              <StatusPill
                icon={Flag}
                label={`${reviewIds.length} review`}
              />
              <StatusPill
                icon={AlarmClock}
                label={
                  deadline
                    ? formatClock(
                        remainingSeconds || 0
                      )
                    : "Untimed"
                }
                warning={
                  remainingSeconds !== null &&
                  remainingSeconds <= 300
                }
              />
              <button
                type="button"
                onClick={() =>
                  setSubmitOpen(true)
                }
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-2 font-bold text-white"
              >
                Submit
                <Send className="h-4 w-4" />
              </button>
            </div>
          </header>

          {expired && !config.autoSubmit && (
            <div className="mb-4 rounded-2xl border border-amber-400/25 bg-amber-500/15 px-4 py-3 text-sm text-amber-100">
              Timer finished. Submit when you are
              ready.
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[260px_1fr]">
            <aside className="rounded-[28px] border border-white/[0.08] bg-white/[0.04] p-4">
              <div className="mb-3 flex items-center justify-between text-sm text-slate-300">
                <span>Questions</span>
                <span>
                  {questions.length} total
                </span>
              </div>

              <div className="grid grid-cols-5 gap-2 sm:grid-cols-8 xl:grid-cols-4">
                {questions.map(
                  (question, index) => {
                    const isAnswered =
                      Boolean(answers[question.id]);
                    const isReview =
                      reviewSet.has(question.id);
                    const isCurrent =
                      question.id ===
                      currentQuestionId;

                    return (
                      <button
                        key={question.id}
                        type="button"
                        aria-label={`Question ${
                          index + 1
                        }`}
                        onClick={() =>
                          setCurrentQuestionId(
                            question.id
                          )
                        }
                        className={`
                          h-11
                          rounded-2xl
                          border
                          text-sm
                          font-bold
                          transition-all
                          ${
                            isCurrent
                              ? "border-blue-400/50 bg-blue-500/25"
                              : isReview
                                ? "border-amber-400/30 bg-amber-500/20"
                                : isAnswered
                                  ? "border-emerald-400/30 bg-emerald-500/20"
                                  : "border-white/[0.08] bg-white/[0.04]"
                          }
                        `}
                      >
                        {index + 1}
                      </button>
                    );
                  }
                )}
              </div>

              <div className="mt-5 space-y-2 text-xs text-slate-300">
                <Legend label="Answered" tone="emerald" />
                <Legend label="Marked for review" tone="amber" />
                <Legend label="Not answered" tone="plain" />
              </div>
            </aside>

            <section className="min-h-[620px] rounded-[28px] border border-white/[0.08] bg-white/[0.04] p-5">
              {currentQuestion && (
                <>
                  <div className="flex flex-col gap-3 border-b border-white/[0.08] pb-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-blue-300">
                        Question {currentIndex + 1}
                      </p>
                      <h2 className="mt-2 max-w-4xl text-xl font-semibold leading-8">
                        {currentQuestion.prompt}
                      </h2>
                    </div>

                    <button
                      type="button"
                      onClick={toggleReview}
                      className={`
                        inline-flex
                        items-center
                        gap-2
                        rounded-2xl
                        border
                        px-4
                        py-3
                        text-sm
                        font-semibold
                        ${
                          reviewSet.has(
                            currentQuestion.id
                          )
                            ? "border-amber-400/35 bg-amber-500/20 text-amber-100"
                            : "border-white/[0.08] bg-white/[0.04] text-slate-200"
                        }
                      `}
                    >
                      <Flag className="h-4 w-4" />
                      Review
                    </button>
                  </div>

                  <div className="mt-5 space-y-3">
                    {currentQuestion.options.map(
                      (option, index) => {
                        const selected =
                          answers[
                            currentQuestion.id
                          ] === option.id;

                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() =>
                              selectAnswer(
                                option.id
                              )
                            }
                            className={`
                              flex
                              w-full
                              items-start
                              gap-4
                              rounded-[24px]
                              border
                              px-4
                              py-4
                              text-left
                              transition-all
                              ${
                                selected
                                  ? "border-blue-400/45 bg-blue-500/20"
                                  : "border-white/[0.08] bg-[#0c201a] hover:border-white/[0.16]"
                              }
                            `}
                          >
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl border border-white/[0.10] bg-white/[0.05] font-bold">
                              {String.fromCharCode(
                                65 + index
                              )}
                            </span>
                            <span className="pt-1 text-base">
                              {option.label}
                            </span>
                          </button>
                        );
                      }
                    )}
                  </div>

                  <footer className="mt-8 flex flex-col gap-3 border-t border-white/[0.08] pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      type="button"
                      onClick={clearAnswer}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 font-semibold text-slate-200"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Clear answer
                    </button>

                    <div className="flex flex-wrap justify-end gap-2">
                      <button
                        type="button"
                        disabled={currentIndex <= 0}
                        onClick={() =>
                          setCurrentQuestionId(
                            questions[
                              currentIndex - 1
                            ].id
                          )
                        }
                        className="inline-flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 font-semibold disabled:opacity-35"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Previous
                      </button>
                      {currentIndex <
                      questions.length - 1 ? (
                        <button
                          type="button"
                          onClick={() =>
                            setCurrentQuestionId(
                              questions[
                                currentIndex + 1
                              ].id
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-2xl bg-blue-500 px-4 py-3 font-bold text-white"
                        >
                          Save and Next
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            setSubmitOpen(true)
                          }
                          className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-3 font-bold text-white"
                        >
                          Submit
                          <Send className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </footer>
                </>
              )}
            </section>
          </div>
        </div>
      </div>

      {submitOpen && (
        <SubmitDialog
          answeredCount={answeredCount}
          onClose={() =>
            setSubmitOpen(false)
          }
          onSubmit={submitAttempt}
          questionCount={questions.length}
          reviewCount={reviewIds.length}
        />
      )}
    </main>
  );
}

function AttemptMessage({
  description,
  title,
}: {
  description: string;
  title: string;
}) {
  return (
    <main className="min-h-screen pl-[120px] pr-5 py-5">
      <div className="rounded-[36px] border border-white/[0.08] bg-[#0a1a16]/80 p-8 text-white">
        <h1 className="text-3xl font-bold">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-slate-300">
          {description}
        </p>
        <Link
          href="/test-portal"
          className="mt-6 inline-flex rounded-2xl bg-blue-500 px-5 py-3 font-semibold text-white"
        >
          Back to Test Portal
        </Link>
      </div>
    </main>
  );
}

function ResultView({
  answers,
  config,
  questions,
  result,
  onExit,
}: {
  answers: AnswerMap;
  config: TestLaunchConfig;
  questions: AttemptQuestion[];
  result: AttemptResult;
  onExit: () => void;
}) {
  const percentage =
    result.maxScore > 0
      ? Math.max(
          0,
          Math.round(
            (result.score /
              result.maxScore) *
              100
          )
        )
      : 0;

  return (
    <main className="min-h-screen pl-[120px] pr-5 py-5 text-white">
      <div className="rounded-[36px] border border-white/[0.06] bg-[#071713] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
        <header className="flex flex-col gap-4 border-b border-white/[0.08] pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-300">
              Attempt complete
            </p>
            <h1 className="mt-1 text-3xl font-bold">
              {config.scope.subTitle}
            </h1>
            <p className="mt-2 text-slate-300">
              {config.scope.exam} /{" "}
              {config.scope.subject}
            </p>
          </div>

          <button
            type="button"
            onClick={onExit}
            className="rounded-2xl bg-blue-500 px-5 py-3 font-bold text-white"
          >
            New Test
          </button>
        </header>

        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-5">
          <Metric
            label="Score"
            value={`${result.score.toFixed(2)}/${result.maxScore}`}
          />
          <Metric
            label="Accuracy"
            value={`${percentage}%`}
          />
          <Metric
            label="Correct"
            value={`${result.correct}`}
          />
          <Metric
            label="Wrong"
            value={`${result.wrong}`}
          />
          <Metric
            label="Skipped"
            value={`${result.skipped}`}
          />
        </div>

        <div className="mt-5 rounded-[28px] border border-white/[0.08] bg-white/[0.04] p-5">
          <h2 className="text-xl font-bold">
            Response review
          </h2>

          <div className="mt-4 space-y-3">
            {questions.map(
              (question, questionIndex) => {
                const answer =
                  answers[question.id];
                const selectedOption =
                  question.options.find(
                    (option) =>
                      option.id === answer
                  );
                const correctOption =
                  question.options.find(
                    (option) =>
                      option.id ===
                      question.correctOptionId
                  );
                const isCorrect =
                  answer ===
                  question.correctOptionId;

                return (
                  <article
                    key={question.id}
                    className="rounded-[24px] border border-white/[0.08] bg-[#0c201a] p-4"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <h3 className="font-semibold">
                        {questionIndex + 1}.{" "}
                        {question.prompt}
                      </h3>
                      <span
                        className={`
                          shrink-0
                          rounded-full
                          px-3
                          py-1
                          text-xs
                          font-bold
                          ${
                            isCorrect
                              ? "bg-emerald-500/20 text-emerald-100"
                              : answer
                                ? "bg-rose-500/20 text-rose-100"
                                : "bg-amber-500/20 text-amber-100"
                          }
                        `}
                      >
                        {isCorrect
                          ? "Correct"
                          : answer
                            ? "Wrong"
                            : "Skipped"}
                      </span>
                    </div>

                    <p className="mt-3 text-sm text-slate-300">
                      Your answer:{" "}
                      {selectedOption?.label ||
                        "Not answered"}
                    </p>

                    {config.showSolutions && (
                      <>
                        <p className="mt-2 text-sm text-emerald-100">
                          Correct answer:{" "}
                          {correctOption?.label}
                        </p>
                        <p className="mt-2 text-sm text-slate-300">
                          {question.explanation}
                        </p>
                      </>
                    )}
                  </article>
                );
              }
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function SubmitDialog({
  answeredCount,
  onClose,
  onSubmit,
  questionCount,
  reviewCount,
}: {
  answeredCount: number;
  onClose: () => void;
  onSubmit: () => void;
  questionCount: number;
  reviewCount: number;
}) {
  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/80 px-4 backdrop-blur-md">
      <button
        type="button"
        aria-label="Close submit confirmation"
        className="absolute inset-0"
        onClick={onClose}
      />
      <section
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-full max-w-lg rounded-[30px] border border-white/[0.08] bg-[#071713] p-6 text-white shadow-[0_20px_80px_rgba(0,0,0,0.7)]"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-blue-300">
              Submit attempt
            </p>
            <h2 className="mt-1 text-2xl font-bold">
              Finish this test?
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close submit confirmation"
            className="rounded-2xl bg-white/[0.06] p-2"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <Metric
            compact
            label="Answered"
            value={`${answeredCount}`}
          />
          <Metric
            compact
            label="Skipped"
            value={`${questionCount - answeredCount}`}
          />
          <Metric
            compact
            label="Review"
            value={`${reviewCount}`}
          />
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 font-semibold"
          >
            Keep Testing
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-3 font-bold"
          >
            Submit
            <CheckCircle2 className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
}

function Metric({
  compact = false,
  label,
  value,
}: {
  compact?: boolean;
  label: string;
  value: string;
}) {
  return (
    <div
      className={`
        rounded-[22px]
        border
        border-white/[0.08]
        bg-white/[0.04]
        ${compact ? "p-3" : "p-4"}
      `}
    >
      <div className="text-xs font-semibold uppercase text-slate-400">
        {label}
      </div>
      <div className="mt-2 break-words text-2xl font-bold text-white">
        {value}
      </div>
    </div>
  );
}

function StatusPill({
  icon: Icon,
  label,
  warning = false,
}: {
  icon: typeof AlarmClock;
  label: string;
  warning?: boolean;
}) {
  return (
    <div
      className={`
        inline-flex
        items-center
        gap-2
        rounded-2xl
        border
        px-3
        py-2
        text-sm
        font-semibold
        ${
          warning
            ? "border-amber-400/30 bg-amber-500/20 text-amber-100"
            : "border-white/[0.08] bg-white/[0.04] text-slate-200"
        }
      `}
    >
      <Icon className="h-4 w-4" />
      {label}
    </div>
  );
}

function Legend({
  label,
  tone,
}: {
  label: string;
  tone: "amber" | "emerald" | "plain";
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`
          h-3
          w-3
          rounded-full
          ${
            tone === "amber"
              ? "bg-amber-400"
              : tone === "emerald"
                ? "bg-emerald-400"
                : "bg-white/30"
          }
        `}
      />
      {label}
    </div>
  );
}
