/**
 * Calculations Service
 * Implements balance calculation logic from DATABASE_ARCHITECTURE.md views
 * Provides financial calculations for expenses, splits, and settlements
 */

import { Injectable } from '@nestjs/common';
import {
    UserBalance,
    GroupSummary,
    DebtSummary
} from '@cost-share/shared';
import { profiles, groups, groupMembers, expenses, expenseSplits, settlements } from '../data/mock-data';

@Injectable()
export class CalculationsService {
    /**
     * Calculate user balances in a group
     * Implements: user_balances_view logic from DATABASE_ARCHITECTURE.md
     * 
     * Balance calculation:
     * netBalance = totalPaid - totalOwed + totalSettledReceived - totalSettledPaid
     * 
     * Positive balance = user is owed money
     * Negative balance = user owes money
     */
    calculateUserBalances(groupId: string, userId?: string): UserBalance[] {
        // Filter expenses for this group (not deleted)
        const groupExpenses = expenses.filter(e => e.groupId === groupId && !e.isDeleted);

        // Get all users in group (or specific user)
        const userIds = userId
            ? [userId]
            : [...new Set(groupMembers
                .filter(gm => gm.groupId === groupId && gm.isActive)
                .map(gm => gm.userId))];

        // Get group's default currency
        const group = groups.find(g => g.id === groupId);
        const defaultCurrency = group?.defaultCurrency || 'USD';

        return userIds.map(uid => {
            // What user paid (sum of expenses where user is payer)
            const totalPaid = groupExpenses
                .filter(e => e.paidBy === uid)
                .reduce((sum, e) => sum + e.amount, 0);

            // What user owes (sum of splits for this user)
            const totalOwed = expenseSplits
                .filter(es => {
                    const expense = groupExpenses.find(e => e.id === es.expenseId);
                    return es.userId === uid && expense;
                })
                .reduce((sum, es) => sum + es.amount, 0);

            // Settlements paid by user (user is paying someone)
            const totalSettledPaid = settlements
                .filter(s => s.groupId === groupId && s.fromUserId === uid)
                .reduce((sum, s) => sum + s.amount, 0);

            // Settlements received by user (someone paid user)
            const totalSettledReceived = settlements
                .filter(s => s.groupId === groupId && s.toUserId === uid)
                .reduce((sum, s) => sum + s.amount, 0);

            // Net balance calculation
            const netBalance = totalPaid - totalOwed + totalSettledReceived - totalSettledPaid;

            return {
                groupId,
                userId: uid,
                currency: defaultCurrency,
                totalPaid: Number(totalPaid.toFixed(2)),
                totalOwed: Number(totalOwed.toFixed(2)),
                totalSettledPaid: Number(totalSettledPaid.toFixed(2)),
                totalSettledReceived: Number(totalSettledReceived.toFixed(2)),
                netBalance: Number(netBalance.toFixed(2)),
            };
        });
    }

    /**
     * Get who owes whom in a group
     * Simplifies debts to minimize number of transactions
     * 
     * Algorithm:
     * 1. Calculate all user balances
     * 2. Separate creditors (positive balance) and debtors (negative balance)
     * 3. Match debtors with creditors to minimize transactions
     */
    getWhoOwesWhom(groupId: string): DebtSummary[] {
        const balances = this.calculateUserBalances(groupId);
        const debts: DebtSummary[] = [];

        // Separate creditors (owed money) and debtors (owe money)
        const creditors = balances
            .filter(b => b.netBalance > 0.01) // Small threshold for floating point
            .map(b => ({ ...b })); // Clone to avoid mutation

        const debtors = balances
            .filter(b => b.netBalance < -0.01)
            .map(b => ({ ...b }));

        // Match each debtor with creditors
        for (const debtor of debtors) {
            let remaining = Math.abs(debtor.netBalance);

            for (const creditor of creditors) {
                if (remaining <= 0.01) break; // Done with this debtor
                if (creditor.netBalance <= 0.01) continue; // Creditor fully paid

                // Amount to transfer (minimum of what debtor owes and creditor is owed)
                const amount = Math.min(remaining, creditor.netBalance);

                // Get user names
                const fromUser = profiles.find(p => p.id === debtor.userId);
                const toUser = profiles.find(p => p.id === creditor.userId);

                debts.push({
                    fromUserId: debtor.userId,
                    fromUserName: fromUser?.name || 'Unknown',
                    toUserId: creditor.userId,
                    toUserName: toUser?.name || 'Unknown',
                    amount: Number(amount.toFixed(2)),
                    currency: debtor.currency,
                });

                // Update remaining amounts
                remaining -= amount;
                creditor.netBalance -= amount;
            }
        }

        return debts;
    }

    /**
     * Calculate group summary statistics
     * Implements: group_summary_view logic from DATABASE_ARCHITECTURE.md
     */
    calculateGroupSummary(groupId: string): GroupSummary | null {
        const group = groups.find(g => g.id === groupId && g.isActive);
        if (!group) return null;

        // Get active members
        const members = groupMembers.filter(gm => gm.groupId === groupId && gm.isActive);

        // Get non-deleted expenses
        const groupExpenses = expenses.filter(e => e.groupId === groupId && !e.isDeleted);

        // Calculate total spent
        const totalSpent = groupExpenses.reduce((sum, e) => sum + e.amount, 0);

        // Find last expense date
        const lastExpenseDate = groupExpenses.length > 0
            ? new Date(Math.max(...groupExpenses.map(e => e.expenseDate.getTime())))
            : undefined;

        return {
            groupId: group.id,
            name: group.name,
            groupType: group.groupType,
            defaultCurrency: group.defaultCurrency,
            memberCount: members.length,
            expenseCount: groupExpenses.length,
            totalSpent: Number(totalSpent.toFixed(2)),
            lastExpenseDate,
            createdAt: group.createdAt,
            updatedAt: group.updatedAt,
        };
    }

    /**
     * Get all group summaries for a user
     */
    getUserGroupSummaries(userId: string): GroupSummary[] {
        // Get all groups user is a member of
        const userGroupIds = groupMembers
            .filter(gm => gm.userId === userId && gm.isActive)
            .map(gm => gm.groupId);

        // Calculate summary for each group
        return userGroupIds
            .map(groupId => this.calculateGroupSummary(groupId))
            .filter((summary): summary is GroupSummary => summary !== null);
    }

    /**
     * Validate if a settlement amount is valid
     * Ensures user doesn't overpay their debt
     */
    validateSettlement(groupId: string, fromUserId: string, toUserId: string, amount: number): {
        valid: boolean;
        message?: string;
        maxAmount?: number;
    } {
        const balances = this.calculateUserBalances(groupId);
        const fromUserBalance = balances.find(b => b.userId === fromUserId);
        const toUserBalance = balances.find(b => b.userId === toUserId);

        if (!fromUserBalance || !toUserBalance) {
            return {
                valid: false,
                message: 'User not found in group',
            };
        }

        // From user should have negative balance (owes money)
        if (fromUserBalance.netBalance >= 0) {
            return {
                valid: false,
                message: 'User does not owe money in this group',
            };
        }

        // To user should have positive balance (is owed money)
        if (toUserBalance.netBalance <= 0) {
            return {
                valid: false,
                message: 'Target user is not owed money in this group',
            };
        }

        // Calculate maximum valid settlement amount
        const maxAmount = Math.min(
            Math.abs(fromUserBalance.netBalance),
            toUserBalance.netBalance
        );

        if (amount > maxAmount + 0.01) { // Small threshold for floating point
            return {
                valid: false,
                message: `Settlement amount exceeds maximum of ${maxAmount.toFixed(2)}`,
                maxAmount: Number(maxAmount.toFixed(2)),
            };
        }

        return {
            valid: true,
            maxAmount: Number(maxAmount.toFixed(2)),
        };
    }

    /**
     * Calculate equal split amounts for an expense
     * Handles rounding to ensure sum equals total
     */
    calculateEqualSplit(totalAmount: number, numPeople: number): number[] {
        const baseAmount = Math.floor((totalAmount * 100) / numPeople) / 100;
        const remainder = Number((totalAmount - (baseAmount * numPeople)).toFixed(2));

        const splits = new Array(numPeople).fill(baseAmount);

        // Add remainder to last person to ensure sum equals total
        if (remainder > 0) {
            splits[splits.length - 1] = Number((splits[splits.length - 1] + remainder).toFixed(2));
        }

        return splits;
    }

    /**
     * Validate expense splits
     * Ensures splits sum to total amount
     */
    validateExpenseSplits(totalAmount: number, splits: { userId: string; amount: number }[]): {
        valid: boolean;
        message?: string;
        difference?: number;
    } {
        const splitSum = splits.reduce((sum, split) => sum + split.amount, 0);
        const difference = Number((totalAmount - splitSum).toFixed(2));

        if (Math.abs(difference) > 0.01) { // Small threshold for floating point
            return {
                valid: false,
                message: `Splits sum (${splitSum.toFixed(2)}) does not equal total amount (${totalAmount.toFixed(2)})`,
                difference,
            };
        }

        // Check for negative amounts
        const hasNegative = splits.some(s => s.amount < 0);
        if (hasNegative) {
            return {
                valid: false,
                message: 'Split amounts cannot be negative',
            };
        }

        return { valid: true };
    }
}
