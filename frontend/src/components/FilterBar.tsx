import { CATEGORIES, CATEGORY_ICONS, Category, ReportType } from '../types';

interface FilterBarProps {
  activeType: ReportType | null;
  activeCategory: Category | null;
  onTypeChange: (type: ReportType | null) => void;
  onCategoryChange: (category: Category | null) => void;
}

export default function FilterBar({ activeType, activeCategory, onTypeChange, onCategoryChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex border border-gray-300 rounded-md overflow-hidden">
        <button
          onClick={() => onTypeChange(activeType === 'LOST' ? null : 'LOST')}
          className={`px-4 py-2 text-sm font-medium ${
            activeType === 'LOST' ? 'bg-red-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Lost
        </button>
        <button
          onClick={() => onTypeChange(activeType === 'FOUND' ? null : 'FOUND')}
          className={`px-4 py-2 text-sm font-medium border-l border-gray-300 ${
            activeType === 'FOUND' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Found
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(activeCategory === cat ? null : cat)}
            className={`px-3 py-2 text-sm rounded-md border ${
              activeCategory === cat
                ? 'border-green-600 bg-green-50 text-green-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {CATEGORY_ICONS[cat]} {cat}
          </button>
        ))}
      </div>
    </div>
  );
}