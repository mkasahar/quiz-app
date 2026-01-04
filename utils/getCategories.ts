import { QuizRow } from "../app/types";

export const getCategories = (all: QuizRow[]) => {
  const set = new Set(all.map((q) => q.category));
  return Array.from(set);
};