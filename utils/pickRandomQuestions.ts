import { QuizRow } from "../app/types";

export const pickRandomQuestions = (all: QuizRow[], count: number) => {
  const shuffled = [...all].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};