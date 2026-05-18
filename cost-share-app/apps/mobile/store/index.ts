/**
 * Zustand Store
 * Global state management for the mobile app
 */

import { create } from 'zustand';
import { User, Group, Expense } from '@cost-share/shared';

interface AppState {
    // User state
    currentUser: User | null;
    setCurrentUser: (user: User | null) => void;

    // Groups state
    groups: Group[];
    setGroups: (groups: Group[]) => void;
    addGroup: (group: Group) => void;

    // Expenses state
    expenses: Expense[];
    setExpenses: (expenses: Expense[]) => void;
    addExpense: (expense: Expense) => void;

    // Language state
    language: 'en' | 'he';
    setLanguage: (language: 'en' | 'he') => void;
}

export const useAppStore = create<AppState>((set) => ({
    // User state
    currentUser: null,
    setCurrentUser: (user) => set({ currentUser: user }),

    // Groups state
    groups: [],
    setGroups: (groups) => set({ groups }),
    addGroup: (group) => set((state) => ({ groups: [...state.groups, group] })),

    // Expenses state
    expenses: [],
    setExpenses: (expenses) => set({ expenses }),
    addExpense: (expense) => set((state) => ({ expenses: [...state.expenses, expense] })),

    // Language state
    language: 'en',
    setLanguage: (language) => set({ language }),
}));
