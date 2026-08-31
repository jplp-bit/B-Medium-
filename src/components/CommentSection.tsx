import React, { useState } from 'react';
import { IComment } from '../types';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Reply, Trash2, Send } from 'lucide-react';

interface CommentSectionProps {
  postId: string;
  comments: IComment[];
  onAddComment: (commentText: string, parentCommentId?: string | null) => void;
  onDeleteComment: (commentId: string) => void;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  onAddComment,
  onDeleteComment,
}) => {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const handleSubmitTopLevel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onAddComment(newComment.trim(), null);
    setNewComment('');
  };

  const handleSubmitReply = (parentId: string) => {
    if (!replyText.trim()) return;
    onAddComment(replyText.trim(), parentId);
    setReplyText('');
    setReplyToId(null);
  };

  // Group top-level comments and replies
  const topLevelComments = comments.filter((c) => !c.parentComment);
  const getReplies = (parentId: string) =>
    comments.filter((c) => c.parentComment === parentId);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-5 h-5 text-neutral-900 dark:text-white" />
        <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
          Responses ({comments.length})
        </h3>
      </div>

      {/* Input Box for New Top-level Comment */}
      {user ? (
        <form onSubmit={handleSubmitTopLevel} className="mb-8">
          <div className="flex gap-3 items-start">
            <img
              src={
                user.avatar ||
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'
              }
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover mt-1"
            />
            <div className="flex-1 space-y-2">
              <textarea
                id="comment-input-textarea"
                rows={3}
                placeholder="What are your thoughts?"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full p-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-blue-600 transition-colors resize-none"
              />
              <div className="flex justify-end">
                <button
                  id="btn-submit-comment"
                  type="submit"
                  disabled={!newComment.trim()}
                  className="px-4 py-2 bg-blue-600 disabled:opacity-50 hover:bg-blue-700 text-white font-medium rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  Respond
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="p-4 bg-neutral-50 dark:bg-neutral-900/60 rounded-xl text-center text-sm text-neutral-500 mb-8 border border-neutral-200/60 dark:border-neutral-800">
          Sign in to leave a response and join the discussion.
        </div>
      )}

      {/* Comment List */}
      <div className="space-y-6">
        {topLevelComments.length === 0 ? (
          <p className="text-sm text-neutral-400 text-center py-6">
            No responses yet. Be the first to share your thoughts!
          </p>
        ) : (
          topLevelComments.map((comment) => {
            const replies = getReplies(comment._id);
            const isOwner = user?._id === comment.user._id || user?.role === 'admin';

            return (
              <div
                key={comment._id}
                className="p-4 bg-white dark:bg-neutral-900/50 border border-neutral-200/80 dark:border-neutral-800/80 rounded-xl space-y-3"
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={
                        comment.user.avatar ||
                        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'
                      }
                      alt={comment.user.name}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                        {comment.user.name}
                      </p>
                      <p className="text-[10px] text-neutral-400">
                        {formatDate(comment.createdAt)}
                      </p>
                    </div>
                  </div>

                  {isOwner && (
                    <button
                      id={`btn-delete-comment-${comment._id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteComment(comment._id);
                      }}
                      className="p-1 rounded text-neutral-400 hover:text-rose-600 transition-colors"
                      title="Delete response"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Content */}
                <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed pl-9">
                  {comment.comment}
                </p>

                {/* Reply Button */}
                {user && (
                  <div className="pl-9 pt-1">
                    <button
                      id={`btn-reply-trigger-${comment._id}`}
                      onClick={() =>
                        setReplyToId(replyToId === comment._id ? null : comment._id)
                      }
                      className="text-xs font-medium text-neutral-500 hover:text-blue-600 flex items-center gap-1 transition-colors"
                    >
                      <Reply className="w-3 h-3" />
                      Reply
                    </button>
                  </div>
                )}

                {/* Inline Reply Input */}
                {replyToId === comment._id && (
                  <div className="ml-9 pt-2 space-y-2">
                    <textarea
                      rows={2}
                      placeholder={`Replying to ${comment.user.name}...`}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="w-full p-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-blue-600 resize-none"
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => setReplyToId(null)}
                        className="px-3 py-1 text-xs text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSubmitReply(comment._id)}
                        disabled={!replyText.trim()}
                        className="px-3 py-1 bg-blue-600 disabled:opacity-50 text-white rounded-lg text-xs font-medium hover:bg-blue-700"
                      >
                        Send Reply
                      </button>
                    </div>
                  </div>
                )}

                {/* Render Nested Replies */}
                {replies.length > 0 && (
                  <div className="ml-8 mt-3 pl-3 border-l-2 border-neutral-200 dark:border-neutral-800 space-y-3">
                    {replies.map((reply) => {
                      const isReplyOwner =
                        user?._id === reply.user._id || user?.role === 'admin';
                      return (
                        <div key={reply._id} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <img
                                src={
                                  reply.user.avatar ||
                                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'
                                }
                                alt={reply.user.name}
                                className="w-5 h-5 rounded-full object-cover"
                              />
                              <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                                {reply.user.name}
                              </span>
                              <span className="text-[10px] text-neutral-400">
                                {formatDate(reply.createdAt)}
                              </span>
                            </div>

                            {isReplyOwner && (
                              <button
                                id={`btn-delete-reply-${reply._id}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteComment(reply._id);
                                }}
                                className="text-neutral-400 hover:text-rose-600 transition-colors"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                          <p className="text-xs text-neutral-600 dark:text-neutral-400 pl-7">
                            {reply.comment}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
