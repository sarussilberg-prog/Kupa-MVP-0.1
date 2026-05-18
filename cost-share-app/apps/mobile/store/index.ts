import { create } from 'zustand';
import { Session } from '@supabase/supabase-js';
import { User, Group, Expense } from '@cost-share/shared';

interface AppState {
    // Auth state
    session: Session | null;
    setSession: (session: Session | null) => void;

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
    // Auth state
    session: null,
    setSession: (session) =>
        set({
            session,
            currentUser: session
                ? {
                      id: session.user.id,
                      email: session.user.email ?? '',
                      name: session.user.user_metadata?.full_name ?? session.user.email ?? '',
                      avatarUrl: session.user.user_metadata?.avatar_url ?? undefined,
                      createdAt: new Date(session.user.created_at),
                      updatedAt: new Date(session.user.updated_at ?? session.user.created_at),
                  }
                : null,
        }),

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
