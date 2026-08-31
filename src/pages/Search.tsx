import React, { useState } from 'react';
import { IPost } from '../types';
import { PostCard } from '../components/PostCard';
import { CategoryPills } from '../components/CategoryPills';
import { Search as SearchIcon, Filter, X } from 'lucide-react';

interface SearchProps {
  posts: IPost[];
  categories: string[];
  initialQuery?: string;
  bookmarkedPostIds: string[];
  onPostClick: (post: IPost) => void;
  onLikeToggle: (postId: string) => void;
  onBookmarkToggle: (postId: string) => void;
  onEditPost: (post: IPost) => void;
  onDeletePost: (postId: string) => void;
}

export const Search: React.FC<SearchProps> = ({
  posts,
  categories,
  initialQuery = '',
  bookmarkedPostIds,
  onPostClick,
  onLikeToggle,
  onBookmarkToggle,
  onEditPost,
  onDeletePost,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Extract all unique tags
  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags || [])));

  // Filter posts
  const searchResults = posts.filter((post) => {
    const q = searchQuery.toLowerCase().trim();

    const matchesQuery =
      !q ||
      post.title.toLowerCase().includes(q) ||
      post.content.toLowerCase().includes(q) ||
      post.author.name.toLowerCase().includes(q) ||
      post.tags.some((t) => t.toLowerCase().includes(q));

    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    const matchesTag = !selectedTag || post.tags.includes(selectedTag);

    return matchesQuery && matchesCategory && matchesTag;
  });

  return (
    <div className="space-y-8">
      {/* Search Header Input */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm space-y-4">
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            id="search-main-input"
            type="text"
            placeholder="Search by keyword, author name, or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-10 py-3 bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 rounded-xl text-base text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-blue-600 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Categories */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            Filter by Category
          </span>
          <CategoryPills
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        {/* Popular Tags */}
        {allTags.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Filter by Tag
            </span>
            <div className="flex flex-wrap gap-1.5">
              {allTags.map((tag) => {
                const isSelected = selectedTag === tag;
                return (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(isSelected ? null : tag)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                      isSelected
                        ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200'
                    }`}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Search Results Summary */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
          Search Results ({searchResults.length})
        </h2>

        {(selectedCategory || selectedTag || searchQuery) && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory(null);
              setSelectedTag(null);
            }}
            className="text-xs text-blue-600 hover:underline font-medium"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Grid of Results */}
      {searchResults.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-8">
          <Filter className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-1">
            No matching stories
          </h3>
          <p className="text-sm text-neutral-500">
            Try adjusting your search keywords or removing selected filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {searchResults.map((post) => (
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
