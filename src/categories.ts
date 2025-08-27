export interface Category {
  id: string;
  name: string;
  allocated: number;
  color: string;
  icon: string;
  gradient: string;
}

export const defaultCategories: Record<string, Category> = {
  Housing: {
    id: 'housing',
    name: 'Housing',
    allocated: 0,
    color: 'from-blue-500 to-blue-600',
    icon: '🏠',
    gradient: 'bg-gradient-to-r from-blue-500 to-blue-600',
  },
  Food: {
    id: 'food',
    name: 'Food',
    allocated: 0,
    color: 'from-green-500 to-emerald-600',
    icon: '🍽️',
    gradient: 'bg-gradient-to-r from-green-500 to-emerald-600',
  },
  Transportation: {
    id: 'transportation',
    name: 'Transportation',
    allocated: 0,
    color: 'from-yellow-500 to-orange-500',
    icon: '🚗',
    gradient: 'bg-gradient-to-r from-yellow-500 to-orange-500',
  },
  Utilities: {
    id: 'utilities',
    name: 'Utilities',
    allocated: 0,
    color: 'from-purple-500 to-violet-600',
    icon: '⚡',
    gradient: 'bg-gradient-to-r from-purple-500 to-violet-600',
  },
  Entertainment: {
    id: 'entertainment',
    name: 'Entertainment',
    allocated: 0,
    color: 'from-pink-500 to-rose-500',
    icon: '🎬',
    gradient: 'bg-gradient-to-r from-pink-500 to-rose-500',
  },
  Healthcare: {
    id: 'healthcare',
    name: 'Healthcare',
    allocated: 0,
    color: 'from-red-500 to-pink-500',
    icon: '🏥',
    gradient: 'bg-gradient-to-r from-red-500 to-pink-500',
  },
  Savings: {
    id: 'savings',
    name: 'Savings',
    allocated: 0,
    color: 'from-indigo-500 to-purple-600',
    icon: '💎',
    gradient: 'bg-gradient-to-r from-indigo-500 to-purple-600',
  },
  Other: {
    id: 'other',
    name: 'Other',
    allocated: 0,
    color: 'from-gray-500 to-slate-600',
    icon: '📦',
    gradient: 'bg-gradient-to-r from-gray-500 to-slate-600',
  },
};

export type CategoriesState = Record<string, Category>;
