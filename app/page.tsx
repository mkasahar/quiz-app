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

export default function Home() {
  const [questions, setQuestions] = useState<QuizRow[]>([]);
  const [loaded, setLoaded] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const [allQuestions, setAllQuestions] = useState<QuizRow[]>([]);

  const [userAnswer, setUserAnswer] = useState<string | null>(null);

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

  const loadStats = () => {
    const data = localStorage.getItem("quiz-stats");
    return data ? JSON.parse(data) : {};
  };

  const saveStats = (stats: any) => {
    localStorage.setItem("quiz-stats", JSON.stringify(stats));
  };

  // 全問終了
  if (loaded && currentIndex >= questions.length) {
    return (
      <main className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">結果</h1>
        <p className="text-xl mb-6">
          あなたの得点：{score} / {questions.length}
        </p>

        {/* リトライボタン */}
        <button
          onClick={resetQuiz}
          className="w-full py-4 bg-blue-500 text-white text-xl rounded-lg"
        >
          もう一度挑戦する
        </button>
      </main>
    );
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">クイズアプリ</h1>

      {!loaded && (
        <button
          onClick={loadCsv}
          className="w-full py-4 bg-blue-500 text-white text-xl rounded-lg"
        >
          スタート
        </button>
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