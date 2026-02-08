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
  const answeredQuestions = new Set(Object.keys(stats).map(Number));

  Object.values(stats).forEach((s) => {
    totalCorrect += s.correct;
    totalWrong += s.wrong;
  });

  const total = totalCorrect + totalWrong;
  const totalRate = total > 0 ? Math.round((totalCorrect / total) * 100) : 0;
  
  const answeredCount = answeredQuestions.size;
  const totalQuestions = allQuestions.length;
  const coverageRate = Math.round((answeredCount / totalQuestions) * 100);

  const categoryStats: Record<string, { correct: number; wrong: number; total: number; answered: number }> = {};

  allQuestions.forEach((q) => {
    if (!categoryStats[q.category]) {
      categoryStats[q.category] = { correct: 0, wrong: 0, total: 0, answered: 0 };
    }
    categoryStats[q.category].total++;
    
    const s = stats[q.no];
    if (s) {
      categoryStats[q.category].correct += s.correct;
      categoryStats[q.category].wrong += s.wrong;
      categoryStats[q.category].answered++;
    }
  });

  // カテゴリ名から章番号を抽出してソートする関数
  const extractChapterNumber = (category: string): number => {
    const match = category.match(/【(\d+)章】/);
    return match ? parseInt(match[1], 10) : 999; // 章番号がない場合は最後に配置
  };

  // カテゴリを章番号順にソート
  const sortedCategories = Object.entries(categoryStats).sort(([catA], [catB]) => {
    const numA = extractChapterNumber(catA);
    const numB = extractChapterNumber(catB);
    return numA - numB;
  });

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">総合成績</h1>

      <div className="bg-blue-50 p-4 rounded-lg mb-4">
        <p className="text-lg mb-2">
          <b>問題カバー率：</b>{answeredCount} / {totalQuestions} 問
        </p>
        <div className="w-full bg-gray-200 rounded-full h-4 mb-3">
          <div
            className="bg-blue-600 h-4 rounded-full transition-all"
            style={{ width: `${coverageRate}%` }}
          />
        </div>
        <p className="text-lg">
          <b>全体正答率：</b>{totalRate}%（{totalCorrect} / {total}）
        </p>
      </div>

      <h2 className="text-xl font-bold mt-6 mb-2">カテゴリ別成績</h2>
      <div className="space-y-3">
        {sortedCategories.map(([cat, s]) => {
          const t = s.correct + s.wrong;
          const r = t > 0 ? Math.round((s.correct / t) * 100) : 0;
          const coverage = Math.round((s.answered / s.total) * 100);
          return (
            <div key={cat} className="bg-gray-50 p-3 rounded">
              <div className="flex justify-between mb-1">
                <p className="font-semibold">{cat}</p>
                <p className="text-sm text-gray-600">
                  {s.answered}/{s.total}問
                </p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${coverage}%` }}
                />
              </div>
              <p className="text-sm">
                正答率：{t > 0 ? `${r}%（${s.correct} / ${t}）` : '---'}
              </p>
            </div>
          );
        })}
      </div>

      <button onClick={onBack} className="btn-gray mt-6">
        戻る
      </button>
    </main>
  );
};