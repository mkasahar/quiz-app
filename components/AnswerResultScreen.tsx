import { QuizRow } from "../app/types";
import { loadStats } from "../utils/statsStorage";

type AnswerResultScreenProps = {
  questions: QuizRow[];
  currentIndex: number;
  isCorrect: boolean | null;
  userAnswer: string | null;
  onNext: () => void;
  onTop: () => void;
};

export const AnswerResultScreen: React.FC<AnswerResultScreenProps> = ({
  questions,
  currentIndex,
  isCorrect,
  userAnswer,
  onNext,
  onTop,
}) => {
  const q = questions[currentIndex];
  const stats = loadStats();
  const s = stats[q.no];

  const rate =
    s
      ? `${Math.round((s.correct / (s.correct + s.wrong)) * 100)}%（${s.correct} / ${
          s.correct + s.wrong
        }）`
      : null;

  return (
    <div className="text-center flex flex-col gap-6">
      <div className="flex justify-end">
        <button
          onClick={onTop}
          className="text-sm text-gray-600 hover:text-gray-900 underline"
        >
          TOPに戻る
        </button>
      </div>

      <p className="text-4xl font-extrabold mb-2">
        {isCorrect ? "🎉 正解！" : "❌ 不正解…"}
      </p>

      <div className="bg-gray-100 p-4 rounded-lg text-left">
        <p>
          <b>あなたの答え：</b> {userAnswer}
        </p>
        <p>
          <b>正解：</b> {q.answer}
        </p>
        {rate && (
          <p className="mt-2">
            <b>累計正答率：</b>
            {rate}
          </p>
        )}
      </div>

      <div className="bg-white p-4 rounded-lg shadow text-left">
        <p className="text-sm text-gray-500 mb-2">カテゴリ：{q.category}</p>
        <p className="text-lg font-semibold mb-3">{q.question}</p>
        {q.description && (
          <p>
            <b>解説：</b>
            {q.description}
          </p>
        )}
      </div>

      <button onClick={onNext} className="btn-blue mt-4">
        次へ
      </button>
    </div>
  );
};