import React from 'react';
import { AlertCircle, ArrowLeft } from 'lucide-react';

interface NotFoundProps {
  onNavigate: (page: string) => void;
}

export const NotFound: React.FC<NotFoundProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-md mx-auto my-20 p-8 text-center space-y-4">
      <div className="w-14 h-14 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-400 flex items-center justify-center mx-auto">
        <AlertCircle className="w-7 h-7" />
      </div>
      <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white">404</h1>
      <p className="text-sm text-neutral-500">
        The article or page you are looking for doesn't exist or has been moved.
      </p>
      <button
        onClick={() => onNavigate('home')}
        className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl text-xs font-medium hover:opacity-90 transition-opacity"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Feed
      </button>
    </div>
  );
};
