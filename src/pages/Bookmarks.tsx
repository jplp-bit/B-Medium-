import React from 'react';
import { IPost } from '../types';
import { PostCard } from '../components/PostCard';
import { Bookmark, Sparkles } from 'lucide-react';

interface BookmarksProps {
  bookmarkedPosts: IPost[];
  bookmarkedPostIds: string[];
  onPostClick: (post: IPost) => void;
  onLikeToggle: (postId: string) => void;
  onBookmarkToggle: (postId: string) => void;
  onEditPost: (post: IPost) => void;
  onDeletePost: (postId: string) => void;
  onNavigate: (page: string) => void;
}

export const Bookmarks: React.FC<BookmarksProps> = ({
  bookmarkedPosts,
  bookmarkedPostIds,
  onPostClick,
  onLikeToggle,
  onBookmarkToggle,
  onEditPost,
  onDeletePost,
  onNavigate,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center">
          <Bookmark className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Saved Bookmarks ({bookmarkedPosts.length})
          </h1>
          <p className="text-xs text-neutral-500">
            Your personal reading list saved for offline reference.
          </p>
        </div>
      </div>

      {bookmarkedPosts.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-xl p-8 space-y-3">
          <Sparkles className="w-10 h-10 text-neutral-300 mx-auto" />
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
            Your reading list is empty
          </h3>
          <p className="text-sm text-neutral-500 max-w-sm mx-auto">
            Save articles you want to read later by clicking the bookmark icon on any post card.
          </p>
          <button
            onClick={() => onNavigate('home')}
            className="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl text-xs font-medium hover:opacity-90 transition-opacity"
          >
            Explore Stories
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookmarkedPosts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onPostClick={onPostClick}
              onLikeToggle={onLikeToggle}
              onBookmarkToggle={onBookmarkToggle}
              isBookmarked={bookmarkedPostIds.includes(post._id)}
              onEdit={onEditPost}
              onDelete={onDeletePost}
            />
          ))}
        </div>
      )}
    </div>
  );
};
