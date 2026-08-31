/**
 * Core Data Models & API Standard Response Interfaces
 */

export type UserRole = 'user' | 'admin';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  bio?: string;
  createdAt: string;
}

export interface IPost {
  _id: string;
  title: string;
  slug: string;
  content: string;
  thumbnail?: string;
  author: IUser;
  category: string;
  tags: string[];
  likes: string[]; // User IDs who liked
  views: number;
  readingTime: number; // in minutes
  createdAt: string;
  updatedAt?: string;
}

export interface IComment {
  _id: string;
  post: string;
  user: IUser;
  comment: string;
  parentComment?: string | null;
  createdAt: string;
}

export interface IBookmark {
  _id: string;
  user: string;
  posts: IPost[];
}

// Standard API Response Contracts
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pages: number;
}
