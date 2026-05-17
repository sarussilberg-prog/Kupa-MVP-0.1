/**
 * Expenses Service
 * Business logic for expense operations
 */

import { Injectable } from '@nestjs/common';
import { Expense, CreateExpenseDto } from '@cost-share/shared';
import { expenses } from '../data/mock-data';
import { generateId } from '@cost-share/shared';

@Injectable()
export class ExpensesService {
    /**
     * Get all expenses
     */
    findAll(): Expense[] {
        return expenses;
    }

    /**
     * Get expense by ID
     */
    findById(id: string): Expense | undefined {
        return expenses.find(expense => expense.id === id);
    }

    /**
     * Get expenses by group ID
     */
    findByGroupId(groupId: string): Expense[] {
        return expenses.filter(expense => expense.groupId === groupId);
    }

    /**
     * Create a new expense
     */
    create(dto: CreateExpenseDto): Expense {
        const newExpense: Expense = {
            id: generateId(),
            groupId: dto.groupId,
            description: dto.description,
            amount: dto.amount,
            currency: dto.currency,
            paidBy: dto.paidBy,
            splitBetween: dto.splitBetween,
            date: dto.date || new Date(),
            category: dto.category,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        expenses.push(newExpense);
        return newExpense;
    }

    /**
     * Get expenses by user ID (where user is involved)
     */
    findByUserId(userId: string): Expense[] {
        return expenses.filter(
            expense =>
                expense.paidBy === userId ||
                expense.splitBetween.includes(userId)
        );
    }
}
