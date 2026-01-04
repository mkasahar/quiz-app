import { QuizRow } from "../app/types";

export const pickCategoryQuestions = (all: QuizRow[], category: string) => {
  const filtered = all.filter((q) => q.category === category);
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 10);
};