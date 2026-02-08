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

      <div className="flex flex-col gap-3">
        {categories.map((cat) => {
          // カテゴリ名を章番号と本文に分割
          const match = cat.match(/【(\d+)章】(.+)/);
          const chapterNum = match ? match[1] : '';
          const chapterTitle = match ? match[2] : cat;

          return (
            <button
              key={cat}
              onClick={() => onSelect(cat)}
              className="btn-purple text-left px-4 py-3 flex items-start gap-3"
            >
              <span className="font-bold text-lg flex-shrink-0">
                {chapterNum}章
              </span>
              <span className="text-sm leading-relaxed break-words">
                {chapterTitle}
              </span>
            </button>
          );
        })}
      </div>

      <button onClick={onBack} className="btn-gray mt-6">
        戻る
      </button>
    </main>
  );
};