import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, Sparkles } from 'lucide-react';

interface LoginProps {
  onNavigate: (page: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onNavigate }) => {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('alex@example.com'); // Pre-fill sample for quick testing
  const [password, setPassword] = useState('password123');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      onNavigate('home');
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-8 bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-xl shadow-sm space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center font-bold text-xl mx-auto shadow-sm">
          B
        </div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
          Welcome back
        </h1>
        <p className="text-xs text-neutral-500">
          Sign in to access your published stories and saved bookmarks.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              id="login-email-input"
              type="email"
              required
              placeholder="you@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-blue-600 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              id="login-password-input"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-blue-600 transition-colors"
            />
          </div>
        </div>

        <button
          id="btn-login-submit"
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 font-medium rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
        >
          <LogIn className="w-4 h-4" />
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      {/* Demo Credentials Quick-Select Helper */}
      <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 text-xs text-neutral-500 space-y-2">
        <p className="font-semibold text-neutral-600 dark:text-neutral-400 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          Demo Accounts for testing:
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setEmail('alex@example.com');
              setPassword('password123');
            }}
            className="px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 rounded text-[11px]"
          >
            Admin (Alex)
          </button>
          <button
            type="button"
            onClick={() => {
              setEmail('sarah@example.com');
              setPassword('password123');
            }}
            className="px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 rounded text-[11px]"
          >
            User (Sarah)
          </button>
        </div>
      </div>

      <div className="text-center text-xs text-neutral-500">
        Don't have an account?{' '}
        <button
          id="link-go-to-register"
          onClick={() => onNavigate('register')}
          className="text-blue-600 hover:underline font-semibold"
        >
          Create an account
        </button>
      </div>
    </div>
  );
};
