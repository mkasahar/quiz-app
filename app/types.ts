export type QuizRow = {
  no: number;
  category: string;
  check?: string;
  answer: string;
  question: string;
  description?: string;
};

export type Stats = {
  [key: number]: {
    correct: number;
    wrong: number;
  };
};