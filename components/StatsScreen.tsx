import { QuizRow } from "../app/types";
import { loadStats } from "../utils/statsStorage";

type StatsScreenProps = {
  allQuestions: QuizRow[];
  onBack: () => void;
};

export const StatsScreen: React.FC<StatsScreenProps> = ({
  allQuestions,
  onBack,
}) => {
  const stats = loadStats();

  let totalCorrect = 0;
  let totalWrong = 0;

  Object.values(stats).forEach((s) => {
    totalCorrect += s.correct;
    totalWrong += s.wrong;
  });

  const total = totalCorrect + totalWrong;
  const totalRate = total > 0 ? Math.round((totalCorrect / total) * 100) : 0;

  const categoryStats: Record<string, { correct: number; wrong: number }> = {};

  allQuestions.forEach((q) => {
    const s = stats[q.no];
    if (!s) return;

    if (!categoryStats[q.category]) {
      categoryStats[q.category] = { correct: 0, wrong: 0 };
    }
    categoryStats[q.category].correct += s.correct;
    categoryStats[q.category].wrong += s.wrong;
  });

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">総合成績</h1>

      <p className="text-xl mb-4">
        全体正答率：{totalRate}%（{totalCorrect} / {total}）
      </p>

      <h2 className="text-xl font-bold mt-6 mb-2">カテゴリ別成績</h2>
      {Object.entries(categoryStats).map(([cat, s]) => {
        const t = s.correct + s.wrong;
        const r = t > 0 ? Math.round((s.correct / t) * 100) : 0;
        return (
          <p key={cat} className="mb-1">
            {cat}：{r}%（{s.correct} / {t}）
          </p>
        );
      })}

      <button onClick={onBack} className="btn-gray mt-4">
        戻る
      </button>
    </main>
  );
};