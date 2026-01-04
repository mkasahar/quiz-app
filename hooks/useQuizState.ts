"use client";

import { useState } from "react";
import { QuizRow } from "../app/types";
import { loadStats, saveStats } from "../utils/statsStorage";

export const useQuizState = () => {
  const [questions, setQuestions] = useState<QuizRow[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [userAnswer, setUserAnswer] = useState<string | null>(null);

  const resetQuizState = () => {
    setCurrentIndex(0);
    setScore(0);
    setShowResult(false);
    setIsCorrect(null);
    setUserAnswer(null);
  };

  const handleAnswer = (answer: string) => {
    const correct = questions[currentIndex].answer === answer;
    setIsCorrect(correct);
    setShowResult(true);
    setUserAnswer(answer);

    const stats = loadStats();
    const qNo = questions[currentIndex].no;

    if (!stats[qNo]) stats[qNo] = { correct: 0, wrong: 0 };
    correct ? stats[qNo].correct++ : stats[qNo].wrong++;
    saveStats(stats);

    if (correct) setScore((prev) => prev + 1);
  };

  const nextQuestion = () => {
    setShowResult(false);
    setIsCorrect(null);
    setUserAnswer(null);
    setCurrentIndex((prev) => prev + 1);
  };

  return {
    questions,
    setQuestions,
    currentIndex,
    score,
    showResult,
    isCorrect,
    userAnswer,
    resetQuizState,
    handleAnswer,
    nextQuestion,
  };
};