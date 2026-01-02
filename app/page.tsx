"use client";

import { useState } from "react";
import Papa from "papaparse";

type QuizRow = {
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

  const pickRandomQuestions = (all: QuizRow[], count: number) => {
    const shuffled = [...all].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };

  const loadCsv = async () => {
    const res = await fetch("/quiz.csv");
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

    if (correct) {
      setScore((prev) => prev + 1);
    }
  };

  const nextQuestion = () => {
    setShowResult(false);
    setIsCorrect(null);
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
        <div className="text-center">
          <p className="text-xl font-bold mb-4">
            {isCorrect ? "正解！" : "不正解…"}
          </p>

          {questions[currentIndex].description && (
            <p className="mb-4">
              解説：{questions[currentIndex].description}
            </p>
          )}

          <button
            onClick={nextQuestion}
            className="w-full py-4 bg-blue-500 text-white text-xl rounded-lg"
          >
            次へ
          </button>
        </div>
      )}
    </main>
  );
}