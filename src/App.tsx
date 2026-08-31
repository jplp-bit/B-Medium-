import React, { useState, useEffect } from 'react';
import { IPost, IComment, IUser, IBookmark } from './types';
import {
  getPostsFromStorage,
  savePostsToStorage,
  getCommentsFromStorage,
  saveCommentsToStorage,
  getBookmarksFromStorage,
  saveBookmarksToStorage,
  getUsersFromStorage,
  saveUsersToStorage,
} from './utils/storage';
import { INITIAL_CATEGORIES } from './data/mockData';
import { ToastProvider, useToast } from './context/ToastContext';
import { ToastContainer } from './components/ToastContainer';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute } from './components/ProtectedRoute';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

import { Home } from './pages/Home';
import { PostDetail } from './pages/PostDetail';
import { PostEditor } from './pages/PostEditor';
import { Search } from './pages/Search';
import { Bookmarks } from './pages/Bookmarks';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';
import { AdminDashboard } from './pages/AdminDashboard';
import { NotFound } from './pages/NotFound';

function MainApp() {
  const { user, users, deleteUser, updateUserRole } = useAuth();
  const { showSuccess, showError, showInfo } = useToast();

  const [currentPage, setCurrentPage] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPost, setSelectedPost] = useState<IPost | null>(null);
  const [editingPost, setEditingPost] = useState<IPost | null>(null);

  // App State collections
  const [posts, setPosts] = useState<IPost[]>([]);
  const [comments, setComments] = useState<IComment[]>([]);
  const [bookmarks, setBookmarks] = useState<IBookmark[]>([]);

  // Load initial data from persistence
  useEffect(() => {
    setPosts(getPostsFromStorage());
    setComments(getCommentsFromStorage());
    setBookmarks(getBookmarksFromStorage());
  }, []);

  // Sync helpers
  const updatePosts = (newPosts: IPost[]) => {
    setPosts(newPosts);
    savePostsToStorage(newPosts);
  };

  const updateComments = (newComments: IComment[]) => {
    setComments(newComments);
    saveCommentsToStorage(newComments);
  };

  const updateBookmarks = (newBookmarks: IBookmark[]) => {
    setBookmarks(newBookmarks);
    saveBookmarksToStorage(newBookmarks);
  };

  // Get bookmarks for active user
  const userBookmarkEntry = bookmarks.find((b) => b.user === user?._id);
  const bookmarkedPosts = userBookmarkEntry ? userBookmarkEntry.posts : [];
  const bookmarkedPostIds = bookmarkedPosts.map((p) => p._id);

  // Handlers
  const handleNavigate = (page: string, params?: any) => {
    setCurrentPage(page);
    if (page !== 'search') {
      // Keep search query if going to search page
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePostClick = (post: IPost) => {
    setSelectedPost(post);
    setCurrentPage('post-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleIncrementView = (postId: string) => {
    const updated = posts.map((p) =>
      p._id === postId ? { ...p, views: p.views + 1 } : p
    );
    updatePosts(updated);
  };

  const handleLikeToggle = (postId: string) => {
    if (!user) {
      showError('Please sign in to like stories.');
      setCurrentPage('login');
      return;
    }

    const updated = posts.map((p) => {
      if (p._id === postId) {
        const hasLiked = p.likes.includes(user._id);
        const newLikes = hasLiked
          ? p.likes.filter((id) => id !== user._id)
          : [...p.likes, user._id];
        return { ...p, likes: newLikes };
      }
      return p;
    });

    updatePosts(updated);

    // If currently viewing details, update selected post state
    if (selectedPost && selectedPost._id === postId) {
      const current = updated.find((p) => p._id === postId);
      if (current) setSelectedPost(current);
    }
  };

  const handleBookmarkToggle = (postId: string) => {
    if (!user) {
      showError('Please sign in to save bookmarks.');
      setCurrentPage('login');
      return;
    }

    const targetPost = posts.find((p) => p._id === postId);
    if (!targetPost) return;

    let updatedBookmarks = [...bookmarks];
    let userEntry = updatedBookmarks.find((b) => b.user === user._id);

    if (!userEntry) {
      userEntry = { _id: `bm-${Date.now()}`, user: user._id, posts: [targetPost] };
      updatedBookmarks.push(userEntry);
      showSuccess('Added to your bookmarks!');
    } else {
      const exists = userEntry.posts.some((p) => p._id === postId);
      if (exists) {
        userEntry.posts = userEntry.posts.filter((p) => p._id !== postId);
        showInfo('Removed from bookmarks.');
      } else {
        userEntry.posts.push(targetPost);
        showSuccess('Added to your bookmarks!');
      }
    }

    updateBookmarks(updatedBookmarks);
  };

  // Create / Edit Post Handler
  const handleSavePost = (postData: Partial<IPost>) => {
    if (editingPost) {
      // Updating
      const updated = posts.map((p) =>
        p._id === editingPost._id ? { ...p, ...postData, updatedAt: new Date().toISOString() } as IPost : p
      );
      updatePosts(updated);
      showSuccess('Article updated successfully!');
      setEditingPost(null);
      setCurrentPage('home');
    } else {
      // Creating New
      const newPost: IPost = {
        _id: `post-${Date.now()}`,
        title: postData.title || 'Untitled',
        slug: postData.slug || 'untitled',
        content: postData.content || '',
        thumbnail: postData.thumbnail,
        author: user!,
        category: postData.category || 'Engineering',
        tags: postData.tags || [],
        likes: [],
        views: 0,
        readingTime: postData.readingTime || 3,
        createdAt: new Date().toISOString(),
      };

      const updated = [newPost, ...posts];
      updatePosts(updated);
      showSuccess('Article published successfully!');
      setCurrentPage('home');
    }
  };

  const handleEditPostTrigger = (post: IPost) => {
    setEditingPost(post);
    setCurrentPage('create-post');
  };

  const handleDeletePost = (postId: string) => {
    const updated = posts.filter((p) => p._id !== postId);
    updatePosts(updated);
    showInfo('Article deleted.');
    if (selectedPost?._id === postId) {
      setSelectedPost(null);
      setCurrentPage('home');
    }
  };

  // Comment Handlers
  const handleAddComment = (commentText: string, parentCommentId?: string | null) => {
    if (!user || !selectedPost) return;

    const newCommentObj: IComment = {
      _id: `comment-${Date.now()}`,
      post: selectedPost._id,
      user,
      comment: commentText,
      parentComment: parentCommentId || null,
      createdAt: new Date().toISOString(),
    };

    const updated = [newCommentObj, ...comments];
    updateComments(updated);
    showSuccess('Response added!');
  };

  const handleDeleteComment = (commentId: string) => {
    const updated = comments.filter((c) => c._id !== commentId && c.parentComment !== commentId);
    updateComments(updated);
    showInfo('Response deleted.');
  };

  // User's own posts
  const userPosts = user ? posts.filter((p) => p.author._id === user._id) : [];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-black text-neutral-900 dark:text-neutral-100 flex flex-col font-sans transition-colors selection:bg-blue-600 selection:text-white">
      <Navbar
        currentTab={currentPage}
        onNavigate={handleNavigate}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentPage === 'home' && (
          <Home
            posts={posts}
            categories={INITIAL_CATEGORIES}
            bookmarkedPostIds={bookmarkedPostIds}
            onPostClick={handlePostClick}
            onLikeToggle={handleLikeToggle}
            onBookmarkToggle={handleBookmarkToggle}
            onEditPost={handleEditPostTrigger}
            onDeletePost={handleDeletePost}
          />
        )}

        {currentPage === 'post-detail' && selectedPost && (
          <PostDetail
            post={selectedPost}
            allPosts={posts}
            comments={comments.filter((c) => c.post === selectedPost._id)}
            isBookmarked={bookmarkedPostIds.includes(selectedPost._id)}
            onBack={() => handleNavigate('home')}
            onPostClick={handlePostClick}
            onLikeToggle={handleLikeToggle}
            onBookmarkToggle={handleBookmarkToggle}
            onAddComment={handleAddComment}
            onDeleteComment={handleDeleteComment}
            onEditPost={handleEditPostTrigger}
            onDeletePost={handleDeletePost}
            onIncrementView={handleIncrementView}
          />
        )}

        {currentPage === 'create-post' && (
          <ProtectedRoute onNavigate={handleNavigate}>
            <PostEditor
              postToEdit={editingPost}
              categories={INITIAL_CATEGORIES}
              onSave={handleSavePost}
              onCancel={() => {
                setEditingPost(null);
                handleNavigate('home');
              }}
            />
          </ProtectedRoute>
        )}

        {currentPage === 'search' && (
          <Search
            posts={posts}
            categories={INITIAL_CATEGORIES}
            initialQuery={searchQuery}
            bookmarkedPostIds={bookmarkedPostIds}
            onPostClick={handlePostClick}
            onLikeToggle={handleLikeToggle}
            onBookmarkToggle={handleBookmarkToggle}
            onEditPost={handleEditPostTrigger}
            onDeletePost={handleDeletePost}
          />
        )}

        {currentPage === 'bookmarks' && (
          <Bookmarks
            bookmarkedPosts={bookmarkedPosts}
            bookmarkedPostIds={bookmarkedPostIds}
            onPostClick={handlePostClick}
            onLikeToggle={handleLikeToggle}
            onBookmarkToggle={handleBookmarkToggle}
            onEditPost={handleEditPostTrigger}
            onDeletePost={handleDeletePost}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'login' && <Login onNavigate={handleNavigate} />}
        {currentPage === 'register' && <Register onNavigate={handleNavigate} />}

        {currentPage === 'profile' && (
          <ProtectedRoute onNavigate={handleNavigate}>
            <Profile
              userPosts={userPosts}
              bookmarkedPostIds={bookmarkedPostIds}
              onPostClick={handlePostClick}
              onLikeToggle={handleLikeToggle}
              onBookmarkToggle={handleBookmarkToggle}
              onEditPost={handleEditPostTrigger}
              onDeletePost={handleDeletePost}
              onNavigate={handleNavigate}
            />
          </ProtectedRoute>
        )}

        {currentPage === 'admin' && (
          <ProtectedRoute requireAdmin={true} onNavigate={handleNavigate}>
            <AdminDashboard
              users={users}
              posts={posts}
              comments={comments}
              onDeleteUser={deleteUser}
              onUpdateUserRole={updateUserRole}
              onDeletePost={handleDeletePost}
              onDeleteComment={handleDeleteComment}
              onNavigatePost={handlePostClick}
            />
          </ProtectedRoute>
        )}

        {currentPage === '404' && <NotFound onNavigate={handleNavigate} />}
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <MainApp />
          <ToastContainer />
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
