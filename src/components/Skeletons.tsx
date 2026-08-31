import React from 'react';

export const PostSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-xl p-5 animate-pulse space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-neutral-200 dark:bg-neutral-800 rounded-lg" />
        <div className="space-y-1.5 flex-1">
          <div className="w-32 h-3.5 bg-neutral-200 dark:bg-neutral-800 rounded" />
          <div className="w-20 h-2.5 bg-neutral-200 dark:bg-neutral-800 rounded" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="w-3/4 h-5 bg-neutral-200 dark:bg-neutral-800 rounded" />
        <div className="w-full h-3.5 bg-neutral-200 dark:bg-neutral-800 rounded" />
        <div className="w-2/3 h-3.5 bg-neutral-200 dark:bg-neutral-800 rounded" />
      </div>
      <div className="w-full h-48 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
      <div className="flex justify-between items-center pt-2">
        <div className="w-24 h-4 bg-neutral-200 dark:bg-neutral-800 rounded" />
        <div className="w-16 h-4 bg-neutral-200 dark:bg-neutral-800 rounded" />
      </div>
    </div>
  );
};

export const CommentSkeleton: React.FC = () => {
  return (
    <div className="p-4 bg-neutral-50 dark:bg-neutral-900/50 rounded-xl animate-pulse space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-neutral-200 dark:bg-neutral-800 rounded-full" />
        <div className="w-28 h-3.5 bg-neutral-200 dark:bg-neutral-800 rounded" />
      </div>
      <div className="w-full h-3 bg-neutral-200 dark:bg-neutral-800 rounded" />
      <div className="w-4/5 h-3 bg-neutral-200 dark:bg-neutral-800 rounded" />
    </div>
  );
};
