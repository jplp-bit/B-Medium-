import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { IPost } from '../types';
import { PostCard } from '../components/PostCard';
import { User, Mail, Shield, Camera, Edit2, Check, PenSquare } from 'lucide-react';

interface ProfileProps {
  userPosts: IPost[];
  bookmarkedPostIds: string[];
  onPostClick: (post: IPost) => void;
  onLikeToggle: (postId: string) => void;
  onBookmarkToggle: (postId: string) => void;
  onEditPost: (post: IPost) => void;
  onDeletePost: (postId: string) => void;
  onNavigate: (page: string) => void;
}

export const Profile: React.FC<ProfileProps> = ({
  userPosts,
  bookmarkedPostIds,
  onPostClick,
  onLikeToggle,
  onBookmarkToggle,
  onEditPost,
  onDeletePost,
  onNavigate,
}) => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  if (!user) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({ name, bio, avatar });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Card Header */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <img
                src={
                  avatar ||
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80'
                }
                alt={user.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-neutral-200 dark:border-neutral-800"
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {user.name}
                </h1>
                {user.role === 'admin' && (
                  <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-950/60 text-blue-600 text-xs font-semibold rounded-md flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Admin
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" />
                {user.email}
              </p>
            </div>
          </div>

          <button
            id="btn-edit-profile-toggle"
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <Edit2 className="w-3.5 h-3.5" />
            {isEditing ? 'Cancel Editing' : 'Edit Profile'}
          </button>
        </div>

        {/* Bio or Edit Form */}
        {isEditing ? (
          <form
            onSubmit={handleSaveProfile}
            className="space-y-4 pt-4 border-t border-neutral-100 dark:border-neutral-800"
          >
            <div>
              <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">
                Full Name
              </label>
              <input
                id="edit-name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-neutral-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">
                Avatar Image URL
              </label>
              <input
                id="edit-avatar-input"
                type="text"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                className="w-full p-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-neutral-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">
                Bio / About You
              </label>
              <textarea
                id="edit-bio-input"
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-neutral-100 resize-none"
              />
            </div>

            <button
              id="btn-save-profile"
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-medium flex items-center gap-1.5 shadow-sm"
            >
              <Check className="w-4 h-4" />
              Save Profile Changes
            </button>
          </form>
        ) : (
          <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed pt-2 border-t border-neutral-100 dark:border-neutral-800">
            {user.bio || 'No bio added yet.'}
          </p>
        )}
      </div>

      {/* User's Written Articles */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
            Your Articles ({userPosts.length})
          </h2>

          <button
            id="btn-write-new-profile"
            onClick={() => onNavigate('create-post')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl text-xs font-medium hover:opacity-90"
          >
            <PenSquare className="w-3.5 h-3.5" />
            Write New
          </button>
        </div>

        {userPosts.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6">
            <p className="text-sm text-neutral-500 mb-3">
              You haven't published any articles yet.
            </p>
            <button
              onClick={() => onNavigate('create-post')}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-medium"
            >
              Write Your First Story
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userPosts.map((post) => (
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
    </div>
  );
};
