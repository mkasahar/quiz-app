import { QuizRow } from "../app/types";

type QuizScreenProps = {
  questions: QuizRow[];
  currentIndex: number;
  onAnswer: (answer: string) => void;
};

export const QuizScreen: React.FC<QuizScreenProps> = ({
  questions,
  currentIndex,
  onAnswer,
}) => {
  const q = questions[currentIndex];

  return (
    <div>
      <p className="text-lg mb-4">
        問題 {currentIndex + 1} / {questions.length}
      </p>

      <p className="text-sm text-gray-600 mb-2">
        カテゴリ：{q.category}
      </p>

      <p className="text-xl font-semibold mb-6">
        {q.question}
      </p>

      <div className="flex flex-col gap-4">
        <button
          onClick={() => onAnswer("正")}
          className="btn-green"
        >
          ○ 正しい
        </button>

        <button
          onClick={() => onAnswer("誤")}
          className="btn-red"
        >
          × 間違い
        </button>
      </div>
    </div>
  );
};