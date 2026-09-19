export type ReportType = 'LOST' | 'FOUND';
export type ReportStatus = 'ACTIVE' | 'RESOLVED';
export type Category = 'Phone' | 'Cars' | 'Pets' | 'People';

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

export interface Report {
  _id: string;
  title: string;
  description: string;
  type: ReportType;
  category: Category;
  location: string;
  date: string;
  imageUrl: string;
  status: ReportStatus;
  createdBy: {
    _id: string;
    name: string;
    phone: string;
    email: string;
  };
  createdAt: string;
}

export interface Filter {
  type?: ReportType;
  category?: Category;
  search?: string;
  location?: string;
  date?: string;
}

export const CATEGORIES: Category[] = ['Phone', 'Cars', 'Pets', 'People'];

export const CATEGORY_ICONS: Record<Category, string> = {
  Phone: '📱',
  Cars: '🚗',
  Pets: '🐾',
  People: '👤',
};