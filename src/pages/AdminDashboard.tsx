import React, { useState } from 'react';
import { IUser, IPost, IComment } from '../types';
import {
  Users,
  FileText,
  Eye,
  Heart,
  Trash2,
  Shield,
  MessageSquare,
  Search,
  CheckCircle,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface AdminDashboardProps {
  users: IUser[];
  posts: IPost[];
  comments: IComment[];
  onDeleteUser: (userId: string) => void;
  onUpdateUserRole: (userId: string, role: 'user' | 'admin') => void;
  onDeletePost: (postId: string) => void;
  onDeleteComment: (commentId: string) => void;
  onNavigatePost: (post: IPost) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  users,
  posts,
  comments,
  onDeleteUser,
  onUpdateUserRole,
  onDeletePost,
  onDeleteComment,
  onNavigatePost,
}) => {
  const { showSuccess } = useToast();
  const [activeTab, setActiveTab] = useState<'users' | 'posts' | 'comments'>('users');
  const [searchFilter, setSearchFilter] = useState('');

  // Statistics
  const totalViews = posts.reduce((acc, p) => acc + p.views, 0);
  const totalLikes = posts.reduce((acc, p) => acc + p.likes.length, 0);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-neutral-900 text-white p-6 sm:p-8 rounded-xl space-y-2 shadow-md">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-blue-500" />
          <h1 className="text-2xl font-bold tracking-tight">Admin Console & Analytics</h1>
        </div>
        <p className="text-xs text-neutral-400 max-w-xl">
          Overview of platform growth, content moderation, user roles, and engagement metrics.
        </p>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-xl space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Users</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-extrabold text-neutral-900 dark:text-white">
            {users.length}
          </p>
        </div>

        <div className="p-5 bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-xl space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Published Posts</span>
            <FileText className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-neutral-900 dark:text-white">
            {posts.length}
          </p>
        </div>

        <div className="p-5 bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-xl space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Views</span>
            <Eye className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-extrabold text-neutral-900 dark:text-white">
            {totalViews.toLocaleString()}
          </p>
        </div>

        <div className="p-5 bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-xl space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Likes</span>
            <Heart className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl font-extrabold text-neutral-900 dark:text-white">
            {totalLikes.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2">
        <div className="flex gap-2 text-sm font-medium">
          <button
            id="tab-admin-users"
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl transition-colors ${
              activeTab === 'users'
                ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            Users ({users.length})
          </button>
          <button
            id="tab-admin-posts"
            onClick={() => setActiveTab('posts')}
            className={`px-4 py-2 rounded-xl transition-colors ${
              activeTab === 'posts'
                ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            Articles ({posts.length})
          </button>
          <button
            id="tab-admin-comments"
            onClick={() => setActiveTab('comments')}
            className={`px-4 py-2 rounded-xl transition-colors ${
              activeTab === 'comments'
                ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            Comments ({comments.length})
          </button>
        </div>

        <div className="relative w-48 sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
          <input
            id="admin-filter-input"
            type="text"
            placeholder="Filter records..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none"
          />
        </div>
      </div>

      {/* Tab 1: Users Management */}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 uppercase font-semibold">
                <tr>
                  <th className="p-3.5">User</th>
                  <th className="p-3.5">Email</th>
                  <th className="p-3.5">Role</th>
                  <th className="p-3.5">Joined</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-neutral-800 dark:text-neutral-200">
                {users
                  .filter(
                    (u) =>
                      u.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
                      u.email.toLowerCase().includes(searchFilter.toLowerCase())
                  )
                  .map((u) => (
                    <tr key={u._id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30">
                      <td className="p-3.5 font-medium flex items-center gap-2.5">
                        <img
                          src={
                            u.avatar ||
                            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'
                          }
                          alt={u.name}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <span>{u.name}</span>
                      </td>
                      <td className="p-3.5 text-neutral-500">{u.email}</td>
                      <td className="p-3.5">
                        <select
                          id={`select-role-${u._id}`}
                          value={u.role}
                          onChange={(e) =>
                            onUpdateUserRole(u._id, e.target.value as 'user' | 'admin')
                          }
                          className="p-1 bg-neutral-100 dark:bg-neutral-800 rounded border border-neutral-200 dark:border-neutral-700 text-xs font-medium"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="p-3.5 text-neutral-400">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          id={`btn-delete-user-${u._id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteUser(u._id);
                          }}
                          className="p-1.5 text-neutral-400 hover:text-rose-600 rounded transition-colors"
                          title="Delete user"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Articles Management */}
      {activeTab === 'posts' && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 uppercase font-semibold">
                <tr>
                  <th className="p-3.5">Article Title</th>
                  <th className="p-3.5">Author</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Views / Likes</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-neutral-800 dark:text-neutral-200">
                {posts
                  .filter(
                    (p) =>
                      p.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
                      p.category.toLowerCase().includes(searchFilter.toLowerCase())
                  )
                  .map((p) => (
                    <tr key={p._id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30">
                      <td
                        onClick={() => onNavigatePost(p)}
                        className="p-3.5 font-bold hover:text-blue-600 cursor-pointer max-w-xs truncate"
                      >
                        {p.title}
                      </td>
                      <td className="p-3.5 text-neutral-600 dark:text-neutral-400">
                        {p.author.name}
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 rounded">
                          {p.category}
                        </span>
                      </td>
                      <td className="p-3.5 text-neutral-500">
                        {p.views} views • {p.likes.length} likes
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          id={`btn-admin-delete-post-${p._id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeletePost(p._id);
                          }}
                          className="p-1.5 text-neutral-400 hover:text-rose-600 rounded transition-colors"
                          title="Delete article"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Comments Moderation */}
      {activeTab === 'comments' && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 space-y-3">
            {comments
              .filter((c) =>
                c.comment.toLowerCase().includes(searchFilter.toLowerCase())
              )
              .map((c) => (
                <div
                  key={c._id}
                  className="p-3 bg-neutral-50 dark:bg-neutral-800/40 rounded-lg flex items-center justify-between text-xs gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-neutral-900 dark:text-white">
                        {c.user.name}
                      </span>
                      <span className="text-neutral-400">•</span>
                      <span className="text-neutral-400">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-neutral-700 dark:text-neutral-300">{c.comment}</p>
                  </div>

                  <button
                    id={`btn-admin-delete-comment-${c._id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteComment(c._id);
                    }}
                    className="p-1.5 text-neutral-400 hover:text-rose-600 transition-colors shrink-0"
                    title="Delete response"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
