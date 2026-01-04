import { QuizRow } from "../app/types";
import { getCategories } from "../utils/getCategories";

type CategorySelectScreenProps = {
  allQuestions: QuizRow[];
  onSelect: (category: string) => void;
  onBack: () => void;
};

export const CategorySelectScreen: React.FC<CategorySelectScreenProps> = ({
  allQuestions,
  onSelect,
  onBack,
}) => {
  const categories = getCategories(allQuestions);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">カテゴリを選択</h1>

      <div className="flex flex-col gap-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className="btn-green"
          >
            {cat}
          </button>
        ))}
      </div>

      <button onClick={onBack} className="btn-gray mt-6">
        戻る
      </button>
    </main>
  );
};