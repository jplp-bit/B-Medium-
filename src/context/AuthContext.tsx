import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { IUser } from '../types';
import {
  getCurrentUserFromStorage,
  setCurrentUserInStorage,
  getUsersFromStorage,
  saveUsersToStorage,
} from '../utils/storage';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: IUser | null;
  users: IUser[];
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (name: string, email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<IUser>) => Promise<boolean>;
  deleteUser: (userId: string) => void;
  updateUserRole: (userId: string, role: 'user' | 'admin') => void;
  refreshUsers: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [users, setUsers] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { showSuccess, showError, showInfo } = useToast();

  const refreshUsers = useCallback(() => {
    const loadedUsers = getUsersFromStorage();
    setUsers(loadedUsers);
  }, []);

  useEffect(() => {
    const activeUser = getCurrentUserFromStorage();
    setUser(activeUser);
    refreshUsers();
    setIsLoading(false);
  }, [refreshUsers]);

  const login = async (email: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 400));

    const allUsers = getUsersFromStorage();
    const foundUser = allUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!foundUser) {
      showError('Invalid email or password.');
      setIsLoading(false);
      return false;
    }

    setUser(foundUser);
    setCurrentUserInStorage(foundUser, `token-${foundUser._id}`);
    refreshUsers();
    showSuccess(`Welcome back, ${foundUser.name}!`);
    setIsLoading(false);
    return true;
  };

  const register = async (name: string, email: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 400));

    const currentUsers = getUsersFromStorage();
    const existing = currentUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (existing) {
      showError('An account with this email already exists.');
      setIsLoading(false);
      return false;
    }

    const newUser: IUser = {
      _id: `user-${Date.now()}`,
      name,
      email,
      role: 'user',
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80`,
      bio: 'New member of the publishing platform.',
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...currentUsers, newUser];
    saveUsersToStorage(updatedUsers);

    setUsers(updatedUsers);
    setUser(newUser);
    setCurrentUserInStorage(newUser, `token-${newUser._id}`);
    showSuccess('Account created successfully!');
    setIsLoading(false);
    return true;
  };

  const logout = useCallback(() => {
    setUser(null);
    setCurrentUserInStorage(null);
    showSuccess('Logged out successfully.');
  }, [showSuccess]);

  const updateProfile = async (updates: Partial<IUser>): Promise<boolean> => {
    if (!user) return false;
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 300));

    const updatedUser: IUser = { ...user, ...updates };
    setUser(updatedUser);

    // Sync in storage and state
    const currentUsers = getUsersFromStorage();
    const updatedUsers = currentUsers.map((u) => (u._id === user._id ? updatedUser : u));
    saveUsersToStorage(updatedUsers);
    setUsers(updatedUsers);
    setCurrentUserInStorage(updatedUser);

    showSuccess('Profile updated successfully!');
    setIsLoading(false);
    return true;
  };

  const deleteUser = (userId: string) => {
    const currentUsers = getUsersFromStorage();
    const updatedUsers = currentUsers.filter((u) => u._id !== userId);
    saveUsersToStorage(updatedUsers);
    setUsers(updatedUsers);

    // If deleting the currently logged-in user account, log out immediately
    if (user && user._id === userId) {
      setUser(null);
      setCurrentUserInStorage(null);
    }

    showInfo('User account deleted.');
  };

  const updateUserRole = (userId: string, role: 'user' | 'admin') => {
    const currentUsers = getUsersFromStorage();
    const updatedUsers = currentUsers.map((u) => (u._id === userId ? { ...u, role } : u));
    saveUsersToStorage(updatedUsers);
    setUsers(updatedUsers);

    if (user && user._id === userId) {
      const updatedSelf = { ...user, role };
      setUser(updatedSelf);
      setCurrentUserInStorage(updatedSelf);
    }

    showSuccess(`User role updated to ${role}.`);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        users,
        isAdmin,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        deleteUser,
        updateUserRole,
        refreshUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
