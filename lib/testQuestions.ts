import type { TestLaunchConfig } from "@/components/TestLauncherModal";

export type AttemptOption = {
  id: string;
  label: string;
};

export type AttemptQuestion = {
  id: string;
  prompt: string;
  options: AttemptOption[];
  correctOptionId: string;
  explanation: string;
  marks: number;
};

function hash(value: string) {
  return value
    .split("")
    .reduce(
      (total, character) =>
        (total * 31 +
          character.charCodeAt(0)) %
        2147483647,
      17
    );
}

function seededShuffle<T>(
  values: T[],
  seed: string
) {
  const nextValues = [...values];
  let nextSeed = hash(seed);

  for (
    let index = nextValues.length - 1;
    index > 0;
    index -= 1
  ) {
    nextSeed =
      (nextSeed * 48271) % 2147483647;
    const swapIndex =
      nextSeed % (index + 1);

    [
      nextValues[index],
      nextValues[swapIndex],
    ] = [
      nextValues[swapIndex],
      nextValues[index],
    ];
  }

  return nextValues;
}

function scopeSeed(config: TestLaunchConfig) {
  return [
    config.scope.exam,
    config.scope.subject,
    config.scope.lectureTitle,
    config.scope.subTitle,
    config.scope.type,
  ].join(":");
}

export function prepareAttemptQuestions(
  questions: AttemptQuestion[],
  config: TestLaunchConfig
) {
  const seed = scopeSeed(config);
  const preparedQuestions = questions.map(
    (question) => ({
      ...question,
      options: config.shuffleOptions
        ? seededShuffle(
            question.options,
            `${seed}:options:${question.id}`
          )
        : question.options,
    })
  );

  return config.shuffleQuestions
    ? seededShuffle(preparedQuestions, seed)
    : preparedQuestions;
}
