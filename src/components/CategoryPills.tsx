import React from 'react';

interface CategoryPillsProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-sm">
      <button
        id="cat-pill-all"
        onClick={() => onSelectCategory(null)}
        className={`px-4 py-1.5 rounded-full whitespace-nowrap font-medium text-xs transition-all ${
          selectedCategory === null
            ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-sm'
            : 'bg-neutral-100 dark:bg-neutral-800/80 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
        }`}
      >
        All Articles
      </button>

      {categories.map((cat) => {
        const isSelected = selectedCategory === cat;
        return (
          <button
            key={cat}
            id={`cat-pill-${cat.toLowerCase().replace(/\s+/g, '-')}`}
            onClick={() => onSelectCategory(isSelected ? null : cat)}
            className={`px-4 py-1.5 rounded-full whitespace-nowrap font-medium text-xs transition-all ${
              isSelected
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
                : 'bg-neutral-100 dark:bg-neutral-800/80 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
};
