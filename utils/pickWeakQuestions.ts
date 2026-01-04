import { QuizRow, Stats } from "../app/types";

export const pickWeakQuestions = (all: QuizRow[], stats: Stats) => {
  const weak = all.filter((q) => {
    const s = stats[q.no];
    if (!s) return false;

    const total = s.correct + s.wrong;
    if (total === 0) return false;

    const rate = s.correct / total;
    return rate < 0.5;
  });

  return weak.sort(() => Math.random() - 0.5).slice(0, 10);
};