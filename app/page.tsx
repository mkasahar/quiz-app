"use client";

import { useState } from "react";
import Papa from "papaparse";

type QuizRow = {
  no: number;
  category: string;
  answer: string;
  question: string;
  description?: string;
};

type Stats = {
  [key: number]: {
    correct: number;
    wrong: number;
  };
};


export default function Home() {
  const [questions, setQuestions] = useState<QuizRow[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [allQuestions, setAllQuestions] = useState<QuizRow[]>([]);
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const [showStatsPage, setShowStatsPage] = useState(false);
  const [weakMode, setWeakMode] = useState(false);
  const [showCategorySelect, setShowCategorySelect] = useState(false);

  const pickRandomQuestions = (all: QuizRow[], count: number) => {
    const shuffled = [...all].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };

  const loadCsv = async () => {
    const res = await fetch(`${location.origin}/quiz.csv`);
    const text = await res.text();

    Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const all = results.data as QuizRow[];
        setAllQuestions(all);
        const selected = pickRandomQuestions(all, 10);
        setQuestions(selected);
        setLoaded(true);
      },
    });
  };

  const handleAnswer = (userAnswer: string) => {
    const correct = questions[currentIndex].answer === userAnswer;
    setIsCorrect(correct);
    setShowResult(true);
    setUserAnswer(userAnswer);

    const stats = loadStats();
    const qNo = questions[currentIndex].no;

    if (!stats[qNo]) {
      stats[qNo] = { correct: 0, wrong: 0 };
    }

    if (correct) {
      stats[qNo].correct += 1;
    } else {
      stats[qNo].wrong += 1;
    }

    saveStats(stats);

    if (correct) {
      setScore((prev) => prev + 1);
    }
  };

  const nextQuestion = () => {
    setShowResult(false);
    setIsCorrect(null);
    setUserAnswer(null);
    setCurrentIndex((prev) => prev + 1);
  };

  const resetQuiz = () => {
    const newQuestions = pickRandomQuestions(allQuestions, 10);
    setQuestions(newQuestions);
    setCurrentIndex(0);
    setScore(0);
    setShowResult(false);
    setIsCorrect(null);
  };

  const loadStats = (): Stats => {
    const data = localStorage.getItem("quiz-stats");
    return data ? (JSON.parse(data) as Stats) : {};
  };

  const saveStats = (stats: Stats) => {
    localStorage.setItem("quiz-stats", JSON.stringify(stats));
  };

  const goToTop = () => {
    setLoaded(false);
    setCurrentIndex(0);
    setScore(0);
    setShowResult(false);
    setIsCorrect(null);
    setUserAnswer(null);
  };

  const pickWeakQuestions = (all: QuizRow[], stats: Stats) => {
    const weak = all.filter(q => {
      const s = stats[q.no];
      if (!s) return false;

      const total = s.correct + s.wrong;
      if (total === 0) return false;

      const rate = s.correct / total;
      return rate < 0.5; // 正答率50%未満
    });

    // 苦手問題が少ない場合はそのまま返す
    return weak.sort(() => Math.random() - 0.5).slice(0, 10);
  };

  const getCategories = () => {
    const set = new Set(allQuestions.map(q => q.category));
    return Array.from(set);
  };

  const pickCategoryQuestions = (category: string) => {
    const filtered = allQuestions.filter(q => q.category === category);
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 10);
  };

  // 全問終了
  if (loaded && currentIndex >= questions.length) {
    return (
      <main className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">
          {weakMode ? "苦手問題モード結果" : "結果"}
        </h1>
        <p className="text-xl mb-6">
          あなたの得点：{score} / {questions.length}
        </p>

        {/* リトライボタン */}
        <button
          onClick={resetQuiz}
          className="w-full py-4 bg-blue-500 text-white text-xl rounded-lg  mb-4"
        >
          もう一度挑戦する
        </button>

        <button
          onClick={goToTop}
          className="w-full py-4 bg-gray-600 text-white text-xl rounded-lg"
        >
          トップに戻る
        </button>

      </main>
    );
  }

  if (showStatsPage) {
    const stats = loadStats();
    const all = allQuestions;

    // 全体集計
    let totalCorrect = 0;
    let totalWrong = 0;

    Object.values(stats).forEach(s => {
      totalCorrect += s.correct;
      totalWrong += s.wrong;
    });

    const total = totalCorrect + totalWrong;
    const totalRate = total > 0 ? Math.round((totalCorrect / total) * 100) : 0;

    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold mb-4">総合成績</h1>

        <p className="text-xl mb-4">
          全体正答率：{totalRate}%（{totalCorrect} / {total}）
        </p>

        {/* カテゴリ別成績 */}
        <h2 className="text-xl font-bold mt-6 mb-2">カテゴリ別成績</h2>
        {(() => {
          const categoryStats: Record<string, { correct: number; wrong: number }> = {};

          all.forEach(q => {
            const s = stats[q.no];
            if (!s) return;

            if (!categoryStats[q.category]) {
              categoryStats[q.category] = { correct: 0, wrong: 0 };
            }
            categoryStats[q.category].correct += s.correct;
            categoryStats[q.category].wrong += s.wrong;
          });

          return Object.entries(categoryStats).map(([cat, s]) => {
            const t = s.correct + s.wrong;
            const r = t > 0 ? Math.round((s.correct / t) * 100) : 0;
            return (
              <p key={cat} className="mb-1">
                {cat}：{r}%（{s.correct} / {t}）
              </p>
            );
          });
        })()}

        <button
          onClick={() => {
            setShowStatsPage(false);
            goToTop();
          }}
          className="w-full py-4 bg-gray-500 text-white text-xl rounded-lg mt-4"
        >
          戻る
        </button>
      </main>
    );
  }

  if (showCategorySelect) {
    const categories = getCategories();

    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold mb-4">カテゴリを選択</h1>

        <div className="flex flex-col gap-4">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => {
                const selected = pickCategoryQuestions(cat);
                setQuestions(selected);
                setLoaded(true);
                setShowCategorySelect(false);
              }}
              className="w-full py-4 bg-green-600 text-white text-xl rounded-lg"
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowCategorySelect(false)}
          className="w-full py-4 bg-gray-500 text-white text-xl rounded-lg mt-6"
        >
          戻る
        </button>
      </main>
    );
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">クイズアプリ</h1>

      {!loaded && (
        <>
          <button
            onClick={loadCsv}
            className="w-full py-4 bg-blue-500 text-white text-xl rounded-lg mb-4"
          >
            ランダム出題
          </button>

          <button
            onClick={async () => {
              if (allQuestions.length === 0) {
                await loadCsv();
              }
              setShowCategorySelect(true);
            }}
            className="w-full py-4 bg-purple-600 text-white text-xl rounded-lg mb-4"
          >
            カテゴリ別に出題する
          </button>

          <button
            onClick={async () => {
              if (allQuestions.length === 0) {
                await loadCsv();
              }

              const stats = loadStats();
              const weak = pickWeakQuestions(allQuestions, stats);

              if (weak.length === 0) {
                alert("苦手問題がまだありません！");
                return;
              }

              setQuestions(weak);
              setWeakMode(true);
              setLoaded(true);
            }}
            className="w-full py-4 bg-orange-500 text-white text-xl rounded-lg mb-4"
          >
            苦手問題だけ出題する
          </button>

          <button
            onClick={async () => {
              if (allQuestions.length === 0) {
                await loadCsv(); // ← ここで読み込む
              }
              setShowStatsPage(true);
            }}
            className="w-full py-4 bg-gray-700 text-white text-xl rounded-lg"
          >
            成績を見る
          </button>
        </>
      )}

      {loaded && !showResult && (
        <div>
          <p className="text-lg mb-4">
            問題 {currentIndex + 1} / {questions.length}
          </p>
          <p className="text-sm text-gray-600 mb-2">
            カテゴリ：{questions[currentIndex].category}
          </p>
          <p className="text-xl font-semibold mb-6">
            {questions[currentIndex].question}
          </p>

          <div className="flex flex-col gap-4">
            <button
              onClick={() => handleAnswer("正")}
              className="w-full py-4 bg-green-500 text-white text-xl rounded-lg"
            >
              ○ 正しい
            </button>
            <button
              onClick={() => handleAnswer("誤")}
              className="w-full py-4 bg-red-500 text-white text-xl rounded-lg"
            >
              × 間違い
            </button>
          </div>
        </div>
      )}

      {loaded && showResult && (
        <div className="text-center flex flex-col gap-6">

          {/* --- 最重要：正解 or 不正解 --- */}
          <div>
            <p className="text-4xl font-extrabold mb-2">
              {isCorrect ? "🎉 正解！" : "❌ 不正解…"}
            </p>
          </div>

          {/* --- 自分の回答 & 累計正答率 --- */}
          <div className="bg-gray-100 p-4 rounded-lg text-left">
            <p className="text-lg mb-1">
              <span className="font-bold">あなたの答え：</span> {userAnswer}
            </p>
            <p className="text-lg mb-1">
              <span className="font-bold">正解：</span> {questions[currentIndex].answer}
            </p>

            {(() => {
              const stats = loadStats();
              const qNo = questions[currentIndex].no;
              const s = stats[qNo];

              if (s) {
                const total = s.correct + s.wrong;
                const rate = Math.round((s.correct / total) * 100);
                return (
                  <p className="text-lg text-gray-700 mt-2">
                    <span className="font-bold">累計正答率：</span>
                    {rate}%（{s.correct} / {total}）
                  </p>
                );
              }
            })()}
          </div>

          {/* --- 参考情報（カテゴリ・問題文・解説） --- */}
          <div className="bg-white p-4 rounded-lg shadow text-left">
            <p className="text-sm text-gray-500 mb-2">
              カテゴリ：{questions[currentIndex].category}
            </p>

            <p className="text-lg font-semibold mb-3">
              {questions[currentIndex].question}
            </p>

            {questions[currentIndex].description && (
              <p className="text-gray-700">
                <span className="font-bold">解説：</span>
                {questions[currentIndex].description}
              </p>
            )}
          </div>

          {/* --- 次へボタン --- */}
          <button
            onClick={nextQuestion}
            className="w-full py-4 bg-blue-500 text-white text-xl rounded-lg mt-4"
          >
            次へ
          </button>
        </div>
      )}
    </main>
  );
}