"use client";

import { useState } from "react";
import Papa from "papaparse";

import { QuizRow } from "./types";
import { useQuizState } from "../hooks/useQuizState";

import { pickRandomQuestions } from "../utils/pickRandomQuestions";
import { pickWeakQuestions } from "../utils/pickWeakQuestions";
import { pickCategoryQuestions } from "../utils/pickCategoryQuestions";
import { loadStats } from "../utils/statsStorage";

import { TopScreen } from "../components/TopScreen";
import { QuizScreen } from "../components/QuizScreen";
import { AnswerResultScreen } from "../components/AnswerResultScreen";
import { ResultScreen } from "../components/ResultScreen";
import { StatsScreen } from "../components/StatsScreen";
import { CategorySelectScreen } from "../components/CategorySelectScreen";

type Mode = "top" | "quiz" | "stats" | "categorySelect";

export default function Home() {
  const [mode, setMode] = useState<Mode>("top");
  const [allQuestions, setAllQuestions] = useState<QuizRow[]>([]);
  const [weakMode, setWeakMode] = useState(false);

  const quiz = useQuizState();

  const ensureCsvLoaded = async (): Promise<QuizRow[]> => {
    if (allQuestions.length > 0) return allQuestions;

    const res = await fetch(`${location.origin}/quiz.csv`);
    const text = await res.text();

    return await new Promise<QuizRow[]>((resolve) => {
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const parsed = results.data as QuizRow[];
          setAllQuestions(parsed);
          resolve(parsed); // ← これが重要
        },
      });
    });
  };

  const startRandom = async () => {
    const all = await ensureCsvLoaded();
    quiz.setQuestions(pickRandomQuestions(all, 10));
    quiz.resetQuizState();
    setWeakMode(false);
    setMode("quiz");
  };

  const startWeak = async () => {
    const all = await ensureCsvLoaded();
    const stats = loadStats();
    const weak = pickWeakQuestions(all, stats);

    if (weak.length === 0) {
      alert("苦手問題がまだありません！");
      return;
    }

    quiz.setQuestions(weak);
    quiz.resetQuizState();
    setWeakMode(true);
    setMode("quiz");
  };

  const startCategorySelect = async () => {
    await ensureCsvLoaded();
    setMode("categorySelect");
  };

  const startCategory = async (category: string) => {
    const all = await ensureCsvLoaded();
    quiz.setQuestions(pickCategoryQuestions(all, category));
    quiz.resetQuizState();
    setWeakMode(false);
    setMode("quiz");
  };

  const showStats = async () => {
    await ensureCsvLoaded();
    setMode("stats");
  };

  const goTop = () => {
    quiz.resetQuizState();
    setWeakMode(false);
    setMode("top");
  };

  const retry = () => {
    weakMode ? startWeak() : startRandom();
  };

  // quiz mode
  if (mode === "quiz") {
    if (quiz.currentIndex >= quiz.questions.length) {
      return (
        <ResultScreen
          weakMode={weakMode}
          score={quiz.score}
          total={quiz.questions.length}
          onRetry={retry}
          onTop={goTop}
        />
      );
    }

    if (quiz.showResult) {
      return (
        <main className="p-6">
          <AnswerResultScreen
            questions={quiz.questions}
            currentIndex={quiz.currentIndex}
            isCorrect={quiz.isCorrect}
            userAnswer={quiz.userAnswer}
            onNext={quiz.nextQuestion}
          />
        </main>
      );
    }

    return (
      <main className="p-6">
        <QuizScreen
          questions={quiz.questions}
          currentIndex={quiz.currentIndex}
          onAnswer={quiz.handleAnswer}
        />
      </main>
    );
  }

  if (mode === "stats") {
    return <StatsScreen allQuestions={allQuestions} onBack={goTop} />;
  }

  if (mode === "categorySelect") {
    return (
      <CategorySelectScreen
        allQuestions={allQuestions}
        onSelect={startCategory}
        onBack={goTop}
      />
    );
  }

  // top
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">クイズアプリ</h1>
      <TopScreen
        onRandom={startRandom}
        onCategory={startCategorySelect}
        onWeak={startWeak}
        onStats={showStats}
      />
    </main>
  );
}