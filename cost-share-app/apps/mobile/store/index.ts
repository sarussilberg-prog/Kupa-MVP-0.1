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
    updateGroup: (group: Group) => void;
    removeGroup: (groupId: string) => void;

    // Expenses state
    expenses: Expense[];
    setExpenses: (expenses: Expense[]) => void;
    addExpense: (expense: Expense) => void;
    updateExpense: (expense: Expense) => void;
    removeExpense: (expenseId: string) => void;

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
    updateGroup: (group) => set((state) => ({
        groups: state.groups.map((g) => (g.id === group.id ? group : g)),
    })),
    removeGroup: (groupId) => set((state) => ({
        groups: state.groups.filter((g) => g.id !== groupId),
    })),

    // Expenses state
    expenses: [],
    setExpenses: (expenses) => set({ expenses }),
    addExpense: (expense) => set((state) => ({ expenses: [...state.expenses, expense] })),
    updateExpense: (expense) => set((state) => ({
        expenses: state.expenses.map((e) => (e.id === expense.id ? expense : e)),
    })),
    removeExpense: (expenseId) => set((state) => ({
        expenses: state.expenses.filter((e) => e.id !== expenseId),
    })),

    // Language state
    language: 'en',
    setLanguage: (language) => set({ language }),
}));
