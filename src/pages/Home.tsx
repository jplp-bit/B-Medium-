import React, { useState } from 'react';
import { IPost } from '../types';
import { PostCard } from '../components/PostCard';
import { CategoryPills } from '../components/CategoryPills';
import { PostSkeleton } from '../components/Skeletons';
import { TrendingUp, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

interface HomeProps {
  posts: IPost[];
  categories: string[];
  bookmarkedPostIds: string[];
  onPostClick: (post: IPost) => void;
  onLikeToggle: (postId: string) => void;
  onBookmarkToggle: (postId: string) => void;
  onEditPost: (post: IPost) => void;
  onDeletePost: (postId: string) => void;
  isLoading?: boolean;
}

export const Home: React.FC<HomeProps> = ({
  posts,
  categories,
  bookmarkedPostIds,
  onPostClick,
  onLikeToggle,
  onBookmarkToggle,
  onEditPost,
  onDeletePost,
  isLoading = false,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  // Filter posts by category
  const filteredPosts = selectedCategory
    ? posts.filter((p) => p.category === selectedCategory)
    : posts;

  // Featured Post (first post or highest views)
  const featuredPost = filteredPosts.length > 0 ? filteredPosts[0] : null;
  const remainingPosts = filteredPosts.length > 1 ? filteredPosts.slice(1) : [];

  // Pagination logic
  const totalPages = Math.ceil(remainingPosts.length / postsPerPage) || 1;
  const paginatedPosts = remainingPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  return (
    <div className="space-y-10">
      {/* Category Pills Header */}
      <div className="pt-2">
        <CategoryPills
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            setCurrentPage(1);
          }}
        />
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <PostSkeleton />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PostSkeleton />
            <PostSkeleton />
          </div>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-xl p-8">
          <Sparkles className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-1">
            No articles found
          </h3>
          <p className="text-sm text-neutral-500">
            Be the first author to publish a story in this publication!
          </p>
        </div>
      ) : (
        <>
          {/* Featured Post Banner */}
          {featuredPost && currentPage === 1 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                Featured Story
              </div>
              <PostCard
                post={featuredPost}
                onPostClick={onPostClick}
                onLikeToggle={onLikeToggle}
                onBookmarkToggle={onBookmarkToggle}
                isBookmarked={bookmarkedPostIds.includes(featuredPost._id)}
                onEdit={onEditPost}
                onDelete={onDeletePost}
                featured={true}
              />
            </div>
          )}

          {/* Latest Articles Feed */}
          {paginatedPosts.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white tracking-tight">
                {selectedCategory ? `${selectedCategory} Articles` : 'Latest Publications'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {paginatedPosts.map((post) => (
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
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-6 border-t border-neutral-200 dark:border-neutral-800">
              <span className="text-xs text-neutral-500">
                Page {currentPage} of {totalPages}
              </span>

              <div className="flex items-center gap-2">
                <button
                  id="btn-prev-page"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 disabled:opacity-40 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  id="btn-next-page"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 disabled:opacity-40 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
