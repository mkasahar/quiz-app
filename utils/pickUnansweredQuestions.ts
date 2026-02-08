import { QuizRow, Stats } from "../app/types";

export const pickUnansweredQuestions = (all: QuizRow[], stats: Stats) => {
  const unanswered = all.filter((q) => {
    return !stats[q.no]; // statsに存在しない = まだ一度も解答していない
  });

  return unanswered.sort(() => Math.random() - 0.5).slice(0, 10);
};