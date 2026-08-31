import React, { useEffect } from 'react';
import { IPost, IComment } from '../types';
import { useAuth } from '../context/AuthContext';
import { CommentSection } from '../components/CommentSection';
import {
  Heart,
  Eye,
  Clock,
  Bookmark,
  Share2,
  ArrowLeft,
  Calendar,
  Tag,
  Edit,
  Trash2,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface PostDetailProps {
  post: IPost;
  allPosts: IPost[];
  comments: IComment[];
  isBookmarked: boolean;
  onBack: () => void;
  onPostClick: (post: IPost) => void;
  onLikeToggle: (postId: string) => void;
  onBookmarkToggle: (postId: string) => void;
  onAddComment: (commentText: string, parentCommentId?: string | null) => void;
  onDeleteComment: (commentId: string) => void;
  onEditPost: (post: IPost) => void;
  onDeletePost: (postId: string) => void;
  onIncrementView: (postId: string) => void;
}

export const PostDetail: React.FC<PostDetailProps> = ({
  post,
  allPosts,
  comments,
  isBookmarked,
  onBack,
  onPostClick,
  onLikeToggle,
  onBookmarkToggle,
  onAddComment,
  onDeleteComment,
  onEditPost,
  onDeletePost,
  onIncrementView,
}) => {
  const { user, isAdmin } = useAuth();
  const { showSuccess } = useToast();
  const isAuthor = user?._id === post.author._id || isAdmin;
  const isLiked = user ? post.likes.includes(user._id) : false;

  // Increment views on load once
  useEffect(() => {
    onIncrementView(post._id);
  }, [post._id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showSuccess('Article link copied to clipboard!');
    }
  };

  // Filter related posts in same category or matching tags
  const relatedPosts = allPosts
    .filter(
      (p) => p._id !== post._id && (p.category === post.category || p.tags.some((t) => post.tags.includes(t)))
    )
    .slice(0, 3);

  // Formatting markdown content paragraphs and code snippets nicely
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    let inCodeBlock = false;
    let codeBuffer: string[] = [];

    return lines.map((line, idx) => {
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          inCodeBlock = false;
          const codeText = codeBuffer.join('\n');
          codeBuffer = [];
          return (
            <pre
              key={idx}
              className="my-6 p-4 bg-neutral-900 text-neutral-100 rounded-xl font-mono text-xs overflow-x-auto border border-neutral-800"
            >
              <code>{codeText}</code>
            </pre>
          );
        } else {
          inCodeBlock = true;
          return null;
        }
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        return null;
      }

      if (line.startsWith('## ')) {
        return (
          <h2 key={idx} className="text-2xl font-bold text-neutral-900 dark:text-white mt-8 mb-3">
            {line.replace('## ', '')}
          </h2>
        );
      }
      if (line.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-xl font-semibold text-neutral-900 dark:text-white mt-6 mb-2">
            {line.replace('### ', '')}
          </h3>
        );
      }
      if (line.startsWith('> ')) {
        return (
          <blockquote
            key={idx}
            className="my-4 pl-4 border-l-4 border-blue-600 italic text-neutral-600 dark:text-neutral-300 text-sm"
          >
            {line.replace('> ', '')}
          </blockquote>
        );
      }
      if (line.startsWith('* ') || line.startsWith('- ')) {
        return (
          <li key={idx} className="ml-5 list-disc text-neutral-700 dark:text-neutral-300 my-1 text-sm leading-relaxed">
            {line.replace(/^[\*\-]\s/, '')}
          </li>
        );
      }

      if (!line.trim()) {
        return <div key={idx} className="h-3" />;
      }

      return (
        <p key={idx} className="text-neutral-800 dark:text-neutral-200 leading-relaxed text-base mb-4">
          {line}
        </p>
      );
    });
  };

  return (
    <article className="max-w-4xl mx-auto space-y-8">
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          id="btn-back-to-feed"
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900 text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {isAuthor && (
          <div className="flex items-center gap-2">
            <button
              id="btn-edit-detail"
              onClick={(e) => {
                e.stopPropagation();
                onEditPost(post);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-xl text-xs font-medium text-neutral-800 dark:text-neutral-200 transition-colors"
            >
              <Edit className="w-3.5 h-3.5" />
              Edit
            </button>
            <button
              id="btn-delete-detail"
              onClick={(e) => {
                e.stopPropagation();
                onDeletePost(post._id);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 rounded-xl text-xs font-medium text-rose-600 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Header Info */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 text-xs font-medium">
          <span className="px-3 py-1 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-lg">
            {post.category}
          </span>
          <span className="text-neutral-400">•</span>
          <span className="flex items-center gap-1 text-neutral-500">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(post.createdAt)}
          </span>
          <span className="text-neutral-400">•</span>
          <span className="flex items-center gap-1 text-neutral-500">
            <Clock className="w-3.5 h-3.5" />
            {post.readingTime} min read
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-neutral-900 dark:text-white tracking-tight leading-tight">
          {post.title}
        </h1>

        {/* Author Details & Quick Actions */}
        <div className="flex items-center justify-between py-4 border-y border-neutral-200/80 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <img
              src={
                post.author.avatar ||
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'
              }
              alt={post.author.name}
              className="w-11 h-11 rounded-full object-cover border border-neutral-200 dark:border-neutral-800"
            />
            <div>
              <p className="font-semibold text-neutral-900 dark:text-white text-sm">
                {post.author.name}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1">
                {post.author.bio || 'Author & Tech Enthusiast'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-like-detail"
              onClick={() => onLikeToggle(post._id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors ${
                isLiked
                  ? 'border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 text-rose-600'
                  : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
              {post.likes.length}
            </button>

            <button
              id="btn-bookmark-detail"
              onClick={() => onBookmarkToggle(post._id)}
              className={`p-2 rounded-xl border text-xs font-medium transition-colors ${
                isBookmarked
                  ? 'border-neutral-900 dark:border-white bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                  : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
              }`}
              title="Bookmark article"
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>

            <button
              id="btn-share-detail"
              onClick={handleShare}
              className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors"
              title="Share article"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Hero Thumbnail */}
      {post.thumbnail && (
        <div className="rounded-xl overflow-hidden border border-neutral-200/80 dark:border-neutral-800 shadow-sm max-h-[480px]">
          <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Main Body Article */}
      <div className="prose dark:prose-invert max-w-none pt-2">
        {renderFormattedContent(post.content)}
      </div>

      {/* Tags Section */}
      {post.tags && post.tags.length > 0 && (
        <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 flex items-center gap-2 flex-wrap">
          <Tag className="w-4 h-4 text-neutral-400" />
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg text-xs font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Comments Component */}
      <CommentSection
        postId={post._id}
        comments={comments}
        onAddComment={onAddComment}
        onDeleteComment={onDeleteComment}
      />

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <div className="pt-12 border-t border-neutral-200 dark:border-neutral-800 space-y-4">
          <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
            Recommended Stories
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedPosts.map((rPost) => (
              <div
                key={rPost._id}
                onClick={() => onPostClick(rPost)}
                className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl cursor-pointer hover:border-neutral-400 transition-all space-y-2"
              >
                <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider">
                  {rPost.category}
                </span>
                <h4 className="text-sm font-bold text-neutral-900 dark:text-white line-clamp-2">
                  {rPost.title}
                </h4>
                <p className="text-xs text-neutral-500">{rPost.readingTime} min read</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};
