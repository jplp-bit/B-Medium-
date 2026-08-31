import React, { useState } from 'react';
import { Search, PenSquare, LogOut, User, Shield, Bookmark, Menu, X, ChevronDown, Sun, Moon, Monitor } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme, ThemeMode } from '../context/ThemeContext';

interface NavbarProps {
  currentTab: string;
  onNavigate: (page: string, params?: any) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  searchQuery,
  onSearchChange,
}) => {
  const { user, isAdmin, logout } = useAuth();
  const { themeMode, effectiveTheme, setThemeMode } = useTheme();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNav = (page: string, params?: any) => {
    onNavigate(page, params);
    setIsProfileOpen(false);
    setIsThemeMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <button
              id="brand-logo"
              onClick={() => handleNav('home')}
              className="flex items-center gap-2 text-left group"
            >
              <div className="w-8 h-8 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center font-bold text-lg shadow-sm group-hover:bg-blue-600 dark:group-hover:bg-blue-600 dark:group-hover:text-white transition-colors">
                B
              </div>
              <span className="font-semibold text-lg tracking-tight text-neutral-900 dark:text-neutral-100">
                Medium<span className="text-blue-600">.</span>
              </span>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-neutral-600 dark:text-neutral-400">
              <button
                id="nav-home"
                onClick={() => handleNav('home')}
                className={`px-3 py-1.5 rounded-xl transition-colors ${
                  currentTab === 'home'
                    ? 'text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800 font-semibold'
                    : 'hover:text-neutral-900 dark:hover:text-neutral-200'
                }`}
              >
                Feed
              </button>
              <button
                id="nav-bookmarks"
                onClick={() => handleNav('bookmarks')}
                className={`px-3 py-1.5 rounded-xl transition-colors ${
                  currentTab === 'bookmarks'
                    ? 'text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800 font-semibold'
                    : 'hover:text-neutral-900 dark:hover:text-neutral-200'
                }`}
              >
                Bookmarks
              </button>
              {isAdmin && (
                <button
                  id="nav-admin"
                  onClick={() => handleNav('admin')}
                  className={`px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 ${
                    currentTab === 'admin'
                      ? 'text-blue-600 bg-blue-50 dark:bg-blue-950/50 font-semibold'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-blue-600'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  Admin
                </button>
              )}
            </nav>
          </div>

          {/* Search Bar Input */}
          <div className="flex-1 max-w-md hidden sm:block">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                id="search-input-desktop"
                type="text"
                placeholder="Search articles, tags, authors..."
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  if (currentTab !== 'search' && e.target.value.trim().length > 0) {
                    onNavigate('search');
                  }
                }}
                className="w-full pl-10 pr-4 py-2 bg-neutral-100 dark:bg-neutral-900 border border-transparent focus:border-neutral-300 dark:focus:border-neutral-700 rounded-xl text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Right Action Items */}
          <div className="flex items-center gap-3">
            {/* Theme Switcher Button & Dropdown */}
            <div className="relative">
              <button
                id="btn-theme-menu"
                onClick={() => {
                  setIsThemeMenuOpen(!isThemeMenuOpen);
                  setIsProfileOpen(false);
                }}
                className="p-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors border border-neutral-200/60 dark:border-neutral-800"
                title={`Theme: ${themeMode} (${effectiveTheme} active)`}
              >
                {effectiveTheme === 'dark' ? (
                  <Moon className="w-4 h-4 text-amber-400" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-500" />
                )}
              </button>

              {isThemeMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl py-1 z-50 animate-in fade-in duration-150">
                  <div className="px-3 py-1 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                    Appearance
                  </div>
                  <button
                    id="theme-option-light"
                    onClick={() => {
                      setThemeMode('light');
                      setIsThemeMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-1.5 text-xs text-left transition-colors ${
                      themeMode === 'light'
                        ? 'text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-950/40'
                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>Light</span>
                  </button>
                  <button
                    id="theme-option-dark"
                    onClick={() => {
                      setThemeMode('dark');
                      setIsThemeMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-1.5 text-xs text-left transition-colors ${
                      themeMode === 'dark'
                        ? 'text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-950/40'
                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5 text-amber-400" />
                    <span>Dark</span>
                  </button>
                  <button
                    id="theme-option-system"
                    onClick={() => {
                      setThemeMode('system');
                      setIsThemeMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-1.5 text-xs text-left transition-colors ${
                      themeMode === 'system'
                        ? 'text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-950/40'
                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5 text-neutral-400" />
                    <span>System</span>
                  </button>
                </div>
              )}
            </div>

            {/* Write Blog Button */}
            {user && (
              <button
                id="btn-write-article"
                onClick={() => handleNav('create-post')}
                className="hidden sm:flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-all shadow-sm shadow-blue-600/20 active:scale-95"
              >
                <PenSquare className="w-4 h-4" />
                <span>Write</span>
              </button>
            )}

            {/* Auth / Profile Area */}
            {user ? (
              <div className="relative">
                <button
                  id="user-menu-trigger"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors border border-neutral-200/60 dark:border-neutral-800"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                    alt={user.name}
                    className="w-8 h-8 rounded-lg object-cover"
                  />
                  <span className="hidden md:inline-block text-sm font-medium text-neutral-800 dark:text-neutral-200 max-w-[120px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown className="w-4 h-4 text-neutral-400 hidden md:block" />
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2.5 border-b border-neutral-100 dark:border-neutral-800">
                      <p className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                        {user.email}
                      </p>
                    </div>

                    <button
                      id="menu-profile"
                      onClick={() => handleNav('profile')}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-left transition-colors"
                    >
                      <User className="w-4 h-4 text-neutral-400" />
                      View Profile
                    </button>

                    <button
                      id="menu-bookmarks"
                      onClick={() => handleNav('bookmarks')}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-left transition-colors"
                    >
                      <Bookmark className="w-4 h-4 text-neutral-400" />
                      Saved Bookmarks
                    </button>

                    {isAdmin && (
                      <button
                        id="menu-admin"
                        onClick={() => handleNav('admin')}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 text-left transition-colors font-medium"
                      >
                        <Shield className="w-4 h-4 text-blue-600" />
                        Admin Dashboard
                      </button>
                    )}

                    <div className="border-t border-neutral-100 dark:border-neutral-800 my-1" />

                    <button
                      id="menu-logout"
                      onClick={() => {
                        logout();
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-left transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  id="btn-login"
                  onClick={() => handleNav('login')}
                  className="px-3.5 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  Sign In
                </button>
                <button
                  id="btn-register"
                  onClick={() => handleNav('register')}
                  className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-900 rounded-xl text-sm font-medium transition-all shadow-sm"
                >
                  Get Started
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="sm:hidden p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="sm:hidden border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-4 pt-2 pb-4 space-y-3">
          <div className="relative pt-2">
            <Search className="absolute left-3 top-5 w-4 h-4 text-neutral-400" />
            <input
              id="search-input-mobile"
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                if (currentTab !== 'search' && e.target.value.trim().length > 0) {
                  onNavigate('search');
                }
              }}
              className="w-full pl-9 pr-4 py-2 bg-neutral-100 dark:bg-neutral-900 border border-transparent rounded-xl text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1 pt-1">
            <button
              onClick={() => handleNav('home')}
              className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-900"
            >
              Feed
            </button>
            <button
              onClick={() => handleNav('bookmarks')}
              className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-900"
            >
              Bookmarks
            </button>

            {user && (
              <button
                onClick={() => handleNav('create-post')}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40"
              >
                <PenSquare className="w-4 h-4" />
                Write Article
              </button>
            )}

            {isAdmin && (
              <button
                onClick={() => handleNav('admin')}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40"
              >
                <Shield className="w-4 h-4" />
                Admin Panel
              </button>
            )}

            {/* Mobile Theme Switcher */}
            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800">
              <p className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 mb-2 px-1">Appearance</p>
              <div className="grid grid-cols-3 gap-1 bg-neutral-100 dark:bg-neutral-900 p-1 rounded-xl">
                <button
                  id="mobile-theme-light"
                  onClick={() => setThemeMode('light')}
                  className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    themeMode === 'light'
                      ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                      : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  Light
                </button>
                <button
                  id="mobile-theme-dark"
                  onClick={() => setThemeMode('dark')}
                  className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    themeMode === 'dark'
                      ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                      : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5 text-amber-400" />
                  Dark
                </button>
                <button
                  id="mobile-theme-system"
                  onClick={() => setThemeMode('system')}
                  className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    themeMode === 'system'
                      ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                      : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5 text-neutral-400" />
                  System
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
