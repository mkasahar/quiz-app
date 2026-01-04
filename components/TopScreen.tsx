type TopScreenProps = {
  onRandom: () => void | Promise<void>;
  onCategory: () => void | Promise<void>;
  onWeak: () => void | Promise<void>;
  onStats: () => void | Promise<void>;
};

export const TopScreen: React.FC<TopScreenProps> = ({
  onRandom,
  onCategory,
  onWeak,
  onStats,
}) => (
  <>
    <button onClick={onRandom} className="btn-blue mb-4">
      ランダム出題
    </button>

    <button onClick={onCategory} className="btn-purple mb-4">
      カテゴリ別に出題
    </button>

    <button onClick={onWeak} className="btn-orange mb-4">
      苦手問題だけ出題
    </button>

    <button onClick={onStats} className="btn-gray">
      成績を見る
    </button>
  </>
);