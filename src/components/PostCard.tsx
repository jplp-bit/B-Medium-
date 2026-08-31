import React from 'react';
import { IPost } from '../types';
import { Heart, Eye, Clock, Bookmark, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface PostCardProps {
  post: IPost;
  onPostClick: (post: IPost) => void;
  onLikeToggle?: (postId: string) => void;
  onBookmarkToggle?: (postId: string) => void;
  isBookmarked?: boolean;
  onEdit?: (post: IPost) => void;
  onDelete?: (postId: string) => void;
  featured?: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onPostClick,
  onLikeToggle,
  onBookmarkToggle,
  isBookmarked = false,
  onEdit,
  onDelete,
  featured = false,
}) => {
  const { user, isAdmin } = useAuth();
  const isAuthor = user?._id === post.author._id || isAdmin;
  const isLiked = user ? post.likes.includes(user._id) : false;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (featured) {
    return (
      <div className="group relative bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 grid grid-cols-1 md:grid-cols-12 gap-0">
        <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            {/* Category & Date */}
            <div className="flex items-center gap-3 mb-4 text-xs">
              <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-lg font-semibold tracking-wide">
                {post.category}
              </span>
              <span className="text-neutral-400">•</span>
              <span className="text-neutral-500 dark:text-neutral-400">
                {formatDate(post.createdAt)}
              </span>
            </div>

            {/* Title */}
            <h2
              id={`post-title-${post._id}`}
              onClick={() => onPostClick(post)}
              className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer mb-3 leading-tight"
            >
              {post.title}
            </h2>

            {/* Snippet */}
            <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base line-clamp-3 mb-6 leading-relaxed">
              {post.content.replace(/#+\s/g, '').replace(/[\*_`]/g, '')}
            </p>
          </div>

          {/* Author & Footer Metadata */}
          <div className="flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-3">
              <img
                src={
                  post.author.avatar ||
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'
                }
                alt={post.author.name}
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 leading-tight">
                  {post.author.name}
                </p>
                <div className="flex items-center gap-2 text-xs text-neutral-400 mt-0.5">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readingTime} min read
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-neutral-500">
              {onLikeToggle ? (
                <button
                  id={`btn-like-featured-${post._id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onLikeToggle(post._id);
                  }}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors ${
                    isLiked ? 'text-rose-600 font-semibold' : 'text-neutral-500 hover:text-rose-600'
                  }`}
                  title={isLiked ? 'Unlike article' : 'Like article'}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isLiked ? 'fill-rose-500 text-rose-500' : 'text-neutral-400'
                    }`}
                  />
                  {post.likes.length}
                </button>
              ) : (
                <span className="flex items-center gap-1">
                  <Heart
                    className={`w-4 h-4 ${
                      isLiked ? 'fill-rose-500 text-rose-500' : 'text-neutral-400'
                    }`}
                  />
                  {post.likes.length}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4 text-neutral-400" />
                {post.views}
              </span>

              {onBookmarkToggle && (
                <button
                  id={`btn-bookmark-featured-${post._id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onBookmarkToggle(post._id);
                  }}
                  className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
                  aria-label="Bookmark post"
                >
                  <Bookmark
                    className={`w-4 h-4 ${
                      isBookmarked ? 'fill-neutral-900 dark:fill-white text-neutral-900 dark:text-white' : ''
                    }`}
                  />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Featured Thumbnail */}
        {post.thumbnail && (
          <div
            onClick={() => onPostClick(post)}
            className="md:col-span-5 relative h-64 md:h-auto overflow-hidden cursor-pointer"
          >
            <img
              src={post.thumbnail}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="group relative bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Author header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <img
              src={
                post.author.avatar ||
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'
              }
              alt={post.author.name}
              className="w-7 h-7 rounded-full object-cover"
            />
            <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200">
              {post.author.name}
            </span>
            <span className="text-neutral-300 dark:text-neutral-700">•</span>
            <span className="text-xs text-neutral-400">{formatDate(post.createdAt)}</span>
          </div>

          <span className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 rounded text-[11px] font-medium">
            {post.category}
          </span>
        </div>

        {/* Thumbnail & Content Layout */}
        <div className="flex gap-4 items-start mb-3">
          <div className="flex-1">
            <h3
              id={`post-card-title-${post._id}`}
              onClick={() => onPostClick(post)}
              className="text-lg font-bold text-neutral-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer line-clamp-2 leading-snug mb-1.5"
            >
              {post.title}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
              {post.content.replace(/#+\s/g, '').replace(/[\*_`]/g, '')}
            </p>
          </div>

          {post.thumbnail && (
            <div
              onClick={() => onPostClick(post)}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden shrink-0 cursor-pointer"
            >
              <img
                src={post.thumbnail}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[11px] px-2 py-0.5 bg-neutral-50 dark:bg-neutral-800/50 text-neutral-500 dark:text-neutral-400 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer Controls */}
      <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-800/80 text-xs text-neutral-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-neutral-500">
            <Clock className="w-3.5 h-3.5" />
            {post.readingTime} min
          </span>
          {onLikeToggle ? (
            <button
              id={`btn-like-${post._id}`}
              onClick={(e) => {
                e.stopPropagation();
                onLikeToggle(post._id);
              }}
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors ${
                isLiked ? 'text-rose-600 font-semibold' : 'text-neutral-500 hover:text-rose-600'
              }`}
              title={isLiked ? 'Unlike article' : 'Like article'}
            >
              <Heart
                className={`w-3.5 h-3.5 ${
                  isLiked ? 'fill-rose-500 text-rose-500' : 'text-neutral-400'
                }`}
              />
              {post.likes.length}
            </button>
          ) : (
            <span className="flex items-center gap-1">
              <Heart
                className={`w-3.5 h-3.5 ${
                  isLiked ? 'fill-rose-500 text-rose-500' : 'text-neutral-400'
                }`}
              />
              {post.likes.length}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-neutral-400" />
            {post.views}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {isAuthor && onEdit && (
            <button
              id={`btn-edit-${post._id}`}
              onClick={(e) => {
                e.stopPropagation();
                onEdit(post);
              }}
              className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
              title="Edit article"
            >
              <Edit className="w-3.5 h-3.5" />
            </button>
          )}

          {isAuthor && onDelete && (
            <button
              id={`btn-delete-${post._id}`}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(post._id);
              }}
              className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-neutral-400 hover:text-rose-600 transition-colors"
              title="Delete article"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          {onBookmarkToggle && (
            <button
              id={`btn-bookmark-${post._id}`}
              onClick={(e) => {
                e.stopPropagation();
                onBookmarkToggle(post._id);
              }}
              className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
              aria-label="Bookmark post"
            >
              <Bookmark
                className={`w-3.5 h-3.5 ${
                  isBookmarked
                    ? 'fill-neutral-900 dark:fill-white text-neutral-900 dark:text-white'
                    : ''
                }`}
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
