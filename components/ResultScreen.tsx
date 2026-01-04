type ResultScreenProps = {
  weakMode: boolean;
  score: number;
  total: number;
  onRetry: () => void;
  onTop: () => void;
};

export const ResultScreen: React.FC<ResultScreenProps> = ({
  weakMode,
  score,
  total,
  onRetry,
  onTop,
}) => (
  <main className="p-6 text-center">
    <h1 className="text-2xl font-bold mb-4">
      {weakMode ? "苦手問題モード結果" : "結果"}
    </h1>

    <p className="text-xl mb-6">
      あなたの得点：{score} / {total}
    </p>

    <button onClick={onRetry} className="btn-blue mb-4">
      もう一度挑戦する
    </button>

    <button onClick={onTop} className="btn-gray">
      トップに戻る
    </button>
  </main>
);