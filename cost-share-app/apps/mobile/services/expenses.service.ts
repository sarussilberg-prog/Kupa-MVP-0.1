/**
 * Expenses Service
 * Business logic for expense operations
 * ALL expense mutations must go through this service
 */

import { Expense, CreateExpenseDto, ApiResponse } from '@cost-share/shared';
import { apiGet, apiPost } from './api';
import { useAppStore } from '../store';

/**
 * Fetch all expenses from API
 */
export async function fetchExpenses(groupId?: string): Promise<Expense[]> {
    const endpoint = groupId ? `/expenses?groupId=${groupId}` : '/expenses';
    const response = await apiGet<Expense[]>(endpoint);

    if (response.success && response.data) {
        // Update store
        useAppStore.getState().setExpenses(response.data);
        return response.data;
    }

    return [];
}

/**
 * Create a new expense
 * This is the ONLY way to create an expense from the UI
 */
export async function createExpense(dto: CreateExpenseDto): Promise<Expense | null> {
    const response = await apiPost<Expense>('/expenses', dto);

    if (response.success && response.data) {
        // Update store
        useAppStore.getState().addExpense(response.data);
        return response.data;
    }

    return null;
}

/**
 * Get expense by ID
 */
export async function getExpenseById(id: string): Promise<Expense | null> {
    const response = await apiGet<Expense>(`/expenses/${id}`);

    if (response.success && response.data) {
        return response.data;
    }

    return null;
}
