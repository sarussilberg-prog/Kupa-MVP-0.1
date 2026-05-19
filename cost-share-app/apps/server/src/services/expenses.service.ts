/**
 * Expenses Service
 * Business logic for expense operations with split support
 */

import { Injectable } from '@nestjs/common';
import { Expense, ExpenseSplit, CreateExpenseDto, UpdateExpenseDto } from '@cost-share/shared';
import { expenses, expenseSplits } from '../data/mock-data';
import { generateId } from '@cost-share/shared';
import { CalculationsService } from './calculations.service';

@Injectable()
export class ExpensesService {
    constructor(private calculationsService: CalculationsService) { }

    /**
     * Get all expenses (non-deleted)
     */
    findAll(): Expense[] {
        return expenses.filter(e => !e.isDeleted);
    }

    /**
     * Get expense by ID
     */
    findById(id: string): Expense | undefined {
        return expenses.find(expense => expense.id === id && !expense.isDeleted);
    }

    /**
     * Get expenses by group ID
     */
    findByGroupId(groupId: string): Expense[] {
        return expenses.filter(expense =>
            expense.groupId === groupId && !expense.isDeleted
        );
    }

    /**
     * Create a new expense with splits
     * Validates splits and creates expense + split records
     */
    create(dto: CreateExpenseDto, createdBy: string): Expense | { error: string } {
        // Calculate splits if not provided or amounts are missing
        const splits = dto.splits.map(s => ({
            userId: s.userId,
            amount: s.amount ?? 0
        }));

        // If any split amount is 0, calculate equal split
        if (splits.some(s => s.amount === 0)) {
            const equalAmounts = this.calculationsService.calculateEqualSplit(
                dto.amount,
                splits.length
            );
            splits.forEach((split, index) => {
                split.amount = equalAmounts[index];
            });
        }

        // Validate splits
        const validation = this.calculationsService.validateExpenseSplits(dto.amount, splits);
        if (!validation.valid) {
            return { error: validation.message || 'Invalid expense splits' };
        }

        // Create expense
        const newExpense: Expense = {
            id: generateId(),
            groupId: dto.groupId,
            description: dto.description,
            amount: dto.amount,
            currency: dto.currency,
            category: dto.category,
            expenseDate: dto.expenseDate || new Date(),
            receiptUrl: dto.receiptUrl,
            paidBy: dto.paidBy,
            createdBy,
            isDeleted: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        expenses.push(newExpense);

        // Create splits
        for (const split of splits) {
            const newSplit: ExpenseSplit = {
                id: generateId(),
                expenseId: newExpense.id,
                userId: split.userId,
                amount: split.amount,
                createdAt: new Date(),
            };
            expenseSplits.push(newSplit);
        }

        return newExpense;
    }

    /**
     * Update expense
     * Note: Updating splits requires deleting old splits and creating new ones
     */
    update(id: string, dto: UpdateExpenseDto): Expense | { error: string } | undefined {
        const expense = expenses.find(e => e.id === id && !e.isDeleted);
        if (!expense) return undefined;

        // If splits are being updated, validate them
        if (dto.splits) {
            const amount = dto.amount ?? expense.amount;
            const splitsWithAmounts = dto.splits.map(s => ({
                userId: s.userId,
                amount: s.amount ?? 0
            }));
            const validation = this.calculationsService.validateExpenseSplits(amount, splitsWithAmounts);
            if (!validation.valid) {
                return { error: validation.message || 'Invalid expense splits' };
            }

            // Remove old splits
            const oldSplitIndices: number[] = [];
            expenseSplits.forEach((split, index) => {
                if (split.expenseId === id) {
                    oldSplitIndices.push(index);
                }
            });
            // Remove in reverse order to maintain indices
            oldSplitIndices.reverse().forEach(index => {
                expenseSplits.splice(index, 1);
            });

            // Add new splits
            for (const split of dto.splits) {
                const newSplit: ExpenseSplit = {
                    id: generateId(),
                    expenseId: id,
                    userId: split.userId,
                    amount: split.amount ?? 0,
                    createdAt: new Date(),
                };
                expenseSplits.push(newSplit);
            }
        }

        // Update expense fields
        Object.assign(expense, {
            description: dto.description ?? expense.description,
            amount: dto.amount ?? expense.amount,
            currency: dto.currency ?? expense.currency,
            category: dto.category ?? expense.category,
            expenseDate: dto.expenseDate ?? expense.expenseDate,
            receiptUrl: dto.receiptUrl ?? expense.receiptUrl,
            updatedAt: new Date(),
        });

        return expense;
    }

    /**
     * Soft delete expense
     */
    delete(id: string): boolean {
        const expense = expenses.find(e => e.id === id);
        if (!expense) return false;

        expense.isDeleted = true;
        expense.updatedAt = new Date();
        return true;
    }

    /**
     * Get expenses by user ID (where user is involved)
     */
    findByUserId(userId: string): Expense[] {
        // Get expense IDs where user has a split
        const userExpenseIds = expenseSplits
            .filter(es => es.userId === userId)
            .map(es => es.expenseId);

        return expenses.filter(expense =>
            !expense.isDeleted &&
            (expense.paidBy === userId || userExpenseIds.includes(expense.id))
        );
    }

    /**
     * Get splits for an expense
     */
    getSplits(expenseId: string): ExpenseSplit[] {
        return expenseSplits.filter(es => es.expenseId === expenseId);
    }

    /**
     * Get expense with splits
     */
    getExpenseWithSplits(expenseId: string): { expense: Expense; splits: ExpenseSplit[] } | undefined {
        const expense = this.findById(expenseId);
        if (!expense) return undefined;

        const splits = this.getSplits(expenseId);
        return { expense, splits };
    }
}
