import { Stats } from "../app/types";

export const loadStats = (): Stats => {
  const data = localStorage.getItem("quiz-stats");
  return data ? (JSON.parse(data) as Stats) : {};
};

export const saveStats = (stats: Stats) => {
  localStorage.setItem("quiz-stats", JSON.stringify(stats));
};