import React, { useState } from 'react';
import { IPost } from '../types';
import { useAuth } from '../context/AuthContext';
import { calculateReadingTime, createSlug } from '../utils/storage';
import { ArrowLeft, Image as ImageIcon, Sparkles, Eye, Edit3 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface PostEditorProps {
  postToEdit?: IPost | null;
  categories: string[];
  onSave: (postData: Partial<IPost>) => void;
  onCancel: () => void;
}

export const PostEditor: React.FC<PostEditorProps> = ({
  postToEdit,
  categories,
  onSave,
  onCancel,
}) => {
  const { user } = useAuth();
  const { showError } = useToast();

  const [title, setTitle] = useState(postToEdit?.title || '');
  const [content, setContent] = useState(postToEdit?.content || '');
  const [category, setCategory] = useState(postToEdit?.category || categories[0] || 'Engineering');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(postToEdit?.tags || ['React', 'Tech']);
  const [thumbnail, setThumbnail] = useState(
    postToEdit?.thumbnail ||
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80'
  );
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    const formattedTag = tagInput.trim().replace(/^#/, '');
    if (!tags.includes(formattedTag)) {
      setTags([...tags, formattedTag]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const insertMarkdownShortcut = (prefix: string, suffix: string = '') => {
    setContent((prev) => `${prev}\n${prefix}Text Here${suffix}\n`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      showError('Article title is required.');
      return;
    }
    if (!content.trim()) {
      showError('Article content cannot be empty.');
      return;
    }

    const calculatedTime = calculateReadingTime(content);
    const slug = createSlug(title);

    onSave({
      title: title.trim(),
      slug,
      content: content.trim(),
      category,
      tags,
      thumbnail,
      readingTime: calculatedTime,
      ...(postToEdit ? {} : { author: user!, likes: [], views: 0 }),
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          id="btn-cancel-editor"
          onClick={onCancel}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900 text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Cancel
        </button>

        <div className="flex items-center gap-3">
          {/* Write / Preview Tab Switcher */}
          <div className="p-1 bg-neutral-100 dark:bg-neutral-900 rounded-xl flex gap-1 border border-neutral-200/80 dark:border-neutral-800 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('write')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-colors ${
                activeTab === 'write'
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              Write
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-colors ${
                activeTab === 'preview'
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Preview
            </button>
          </div>

          <button
            id="btn-publish-story"
            onClick={handleSubmit}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-sm transition-all shadow-sm shadow-blue-600/20 active:scale-95"
          >
            {postToEdit ? 'Save Changes' : 'Publish Story'}
          </button>
        </div>
      </div>

      {activeTab === 'write' ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <div>
            <input
              id="editor-title-input"
              type="text"
              placeholder="Title of your story..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-3xl sm:text-4xl font-extrabold bg-transparent text-neutral-900 dark:text-white placeholder-neutral-300 dark:placeholder-neutral-700 focus:outline-none tracking-tight"
            />
            {title && (
              <p className="text-xs text-neutral-400 mt-1 font-mono">
                URL Slug: /post/{createSlug(title)}
              </p>
            )}
          </div>

          {/* Meta Inputs (Category, Thumbnail URL, Tags) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl">
            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                id="editor-category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Thumbnail Image URL */}
            <div>
              <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5" />
                Cover Image URL
              </label>
              <input
                id="editor-thumbnail-input"
                type="text"
                placeholder="https://images.unsplash.com/..."
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                className="w-full p-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none"
              />
            </div>

            {/* Tags Input */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1.5">
                Tags
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  id="editor-tag-input"
                  type="text"
                  placeholder="Add tag (e.g. React) and press Enter..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  className="flex-1 p-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3 py-1.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg text-xs font-medium"
                >
                  Add
                </button>
              </div>

              {/* Tags Badges */}
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-md text-xs font-medium"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-neutral-400 hover:text-rose-500 ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Markdown Formatting Toolbar */}
          <div className="flex flex-wrap items-center gap-2 p-2 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs font-mono">
            <span className="text-neutral-400 text-[10px] font-sans font-semibold uppercase px-2">
              Quick Format:
            </span>
            <button
              type="button"
              onClick={() => insertMarkdownShortcut('## ')}
              className="px-2 py-1 bg-white dark:bg-neutral-800 rounded border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50"
            >
              H2
            </button>
            <button
              type="button"
              onClick={() => insertMarkdownShortcut('### ')}
              className="px-2 py-1 bg-white dark:bg-neutral-800 rounded border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50"
            >
              H3
            </button>
            <button
              type="button"
              onClick={() => insertMarkdownShortcut('**', '**')}
              className="px-2 py-1 bg-white dark:bg-neutral-800 rounded border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 font-bold"
            >
              B
            </button>
            <button
              type="button"
              onClick={() => insertMarkdownShortcut('> ')}
              className="px-2 py-1 bg-white dark:bg-neutral-800 rounded border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 italic"
            >
              Quote
            </button>
            <button
              type="button"
              onClick={() => insertMarkdownShortcut('```typescript\n', '\n```')}
              className="px-2 py-1 bg-white dark:bg-neutral-800 rounded border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50"
            >
              Code Block
            </button>
            <button
              type="button"
              onClick={() => insertMarkdownShortcut('* ')}
              className="px-2 py-1 bg-white dark:bg-neutral-800 rounded border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50"
            >
              List Item
            </button>
          </div>

          {/* Main Markdown Textarea */}
          <div>
            <textarea
              id="editor-content-textarea"
              rows={16}
              placeholder="Tell your story using Markdown syntax..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl font-mono text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-blue-600 transition-colors leading-relaxed"
            />
          </div>
        </form>
      ) : (
        /* Preview Tab View */
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-neutral-100 dark:border-neutral-800 pb-4">
            <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-950/60 text-blue-600 text-xs font-semibold rounded-md">
              {category}
            </span>
            <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white mt-2">
              {title || 'Untitled Article'}
            </h1>
          </div>

          {thumbnail && (
            <img
              src={thumbnail}
              alt="Preview thumbnail"
              className="w-full h-64 object-cover rounded-xl"
            />
          )}

          <div className="text-neutral-800 dark:text-neutral-200 leading-relaxed whitespace-pre-wrap font-sans text-base">
            {content || 'Start writing to see preview output...'}
          </div>
        </div>
      )}
    </div>
  );
};
