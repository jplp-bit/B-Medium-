import { IUser, IPost, IComment, IBookmark } from '../types';
import { INITIAL_USERS, INITIAL_POSTS, INITIAL_COMMENTS } from '../data/mockData';

const KEYS = {
  USERS: 'blog_platform_users',
  POSTS: 'blog_platform_posts',
  COMMENTS: 'blog_platform_comments',
  BOOKMARKS: 'blog_platform_bookmarks',
  CURRENT_USER: 'blog_platform_current_user',
  AUTH_TOKEN: 'blog_platform_token',
};

// Initialize Storage with seed data if empty
export function initStorage(): void {
  if (!localStorage.getItem(KEYS.USERS)) {
    localStorage.setItem(KEYS.USERS, JSON.stringify(INITIAL_USERS));
  }
  if (!localStorage.getItem(KEYS.POSTS)) {
    localStorage.setItem(KEYS.POSTS, JSON.stringify(INITIAL_POSTS));
  }
  if (!localStorage.getItem(KEYS.COMMENTS)) {
    localStorage.setItem(KEYS.COMMENTS, JSON.stringify(INITIAL_COMMENTS));
  }
  if (!localStorage.getItem(KEYS.BOOKMARKS)) {
    const initialBookmarks: IBookmark[] = [
      {
        _id: 'bm-1',
        user: 'user-2',
        posts: [INITIAL_POSTS[0]]
      }
    ];
    localStorage.setItem(KEYS.BOOKMARKS, JSON.stringify(initialBookmarks));
  }
  // Default logged in user for immediate experience if needed
  if (!localStorage.getItem(KEYS.CURRENT_USER)) {
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(INITIAL_USERS[0]));
    localStorage.setItem(KEYS.AUTH_TOKEN, 'mock-jwt-token-admin');
  }
}

// User Storage Helpers
export function getUsersFromStorage(): IUser[] {
  initStorage();
  const data = localStorage.getItem(KEYS.USERS);
  return data ? JSON.parse(data) : INITIAL_USERS;
}

export function saveUsersToStorage(users: IUser[]): void {
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
}

export function getCurrentUserFromStorage(): IUser | null {
  initStorage();
  const data = localStorage.getItem(KEYS.CURRENT_USER);
  return data ? JSON.parse(data) : null;
}

export function setCurrentUserInStorage(user: IUser | null, token: string = ''): void {
  if (user) {
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
    localStorage.setItem(KEYS.AUTH_TOKEN, token || `mock-token-${user._id}`);
  } else {
    localStorage.removeItem(KEYS.CURRENT_USER);
    localStorage.removeItem(KEYS.AUTH_TOKEN);
  }
}

export function getAuthToken(): string | null {
  return localStorage.getItem(KEYS.AUTH_TOKEN);
}

// Post Storage Helpers
export function getPostsFromStorage(): IPost[] {
  initStorage();
  const data = localStorage.getItem(KEYS.POSTS);
  return data ? JSON.parse(data) : INITIAL_POSTS;
}

export function savePostsToStorage(posts: IPost[]): void {
  localStorage.setItem(KEYS.POSTS, JSON.stringify(posts));
}

// Comment Storage Helpers
export function getCommentsFromStorage(): IComment[] {
  initStorage();
  const data = localStorage.getItem(KEYS.COMMENTS);
  return data ? JSON.parse(data) : INITIAL_COMMENTS;
}

export function saveCommentsToStorage(comments: IComment[]): void {
  localStorage.setItem(KEYS.COMMENTS, JSON.stringify(comments));
}

// Bookmark Storage Helpers
export function getBookmarksFromStorage(): IBookmark[] {
  initStorage();
  const data = localStorage.getItem(KEYS.BOOKMARKS);
  return data ? JSON.parse(data) : [];
}

export function saveBookmarksToStorage(bookmarks: IBookmark[]): void {
  localStorage.setItem(KEYS.BOOKMARKS, JSON.stringify(bookmarks));
}

// Reading time calculator utility (approx 200 words per minute)
export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const noOfWords = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(noOfWords / wordsPerMinute);
  return minutes > 0 ? minutes : 1;
}

// Slug generator utility
export function createSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
