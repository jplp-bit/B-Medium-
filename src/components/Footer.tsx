import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { themeMode, setThemeMode } = useTheme();

  return (
    <footer className="mt-20 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Column 1: Brand & Bio */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center font-bold text-sm">
                B
              </div>
              <span className="font-semibold text-lg tracking-tight text-neutral-900 dark:text-neutral-100">
                Medium<span className="text-blue-600">.</span>
              </span>
            </div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-sm">
              An open publishing platform for developers, designers, and thinkers. Express ideas, read high-impact articles, and stay curious.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
              Explore
            </h4>
            <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  Home Feed
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('search')}
                  className="hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  Search Articles
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('bookmarks')}
                  className="hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  Bookmarks
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Newsletter */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
              Stay Updated
            </h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Get weekly highlights delivered to your inbox.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input
                type="email"
                placeholder="Enter email..."
                className="w-full px-3 py-1.5 text-xs bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:border-neutral-400"
              />
              <button
                type="submit"
                className="px-3 py-1.5 text-xs bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium rounded-lg hover:opacity-90 transition-opacity"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-100 dark:border-neutral-900 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 dark:text-neutral-500 gap-4">
          <p>© {new Date().getFullYear()} Medium Blog Platform. All rights reserved.</p>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-900 p-1 rounded-lg border border-neutral-200/50 dark:border-neutral-800">
              <button
                id="footer-theme-light"
                onClick={() => setThemeMode('light')}
                className={`p-1 rounded-md transition-colors ${
                  themeMode === 'light'
                    ? 'bg-white dark:bg-neutral-800 text-amber-500 shadow-xs'
                    : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
                }`}
                title="Light mode"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                id="footer-theme-dark"
                onClick={() => setThemeMode('dark')}
                className={`p-1 rounded-md transition-colors ${
                  themeMode === 'dark'
                    ? 'bg-white dark:bg-neutral-800 text-amber-400 shadow-xs'
                    : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
                }`}
                title="Dark mode"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
              <button
                id="footer-theme-system"
                onClick={() => setThemeMode('system')}
                className={`p-1 rounded-md transition-colors ${
                  themeMode === 'system'
                    ? 'bg-white dark:bg-neutral-800 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
                }`}
                title="System mode"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <span className="hover:text-neutral-600 transition-colors cursor-pointer">Privacy Policy</span>
              <span className="hover:text-neutral-600 transition-colors cursor-pointer">Terms of Service</span>
              <span className="hover:text-neutral-600 transition-colors cursor-pointer">Security</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
