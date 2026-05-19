/**
 * Mock in-memory database
 * Simulates the database structure from DATABASE_ARCHITECTURE.md
 * Updated to match new schema with splits and settlements
 */

import {
    Profile,
    Group,
    GroupMember,
    Expense,
    ExpenseSplit,
    Settlement
} from '@cost-share/shared';

/**
 * Mock Profiles (was Users)
 */
export const profiles: Profile[] = [
    {
        id: 'profile-1',
        name: 'John Doe',
        avatarUrl: 'https://i.pravatar.cc/150?img=1',
        phone: '+1234567890',
        defaultCurrency: 'USD',
        language: 'en',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
    },
    {
        id: 'profile-2',
        name: 'Jane Smith',
        avatarUrl: 'https://i.pravatar.cc/150?img=2',
        phone: '+1234567891',
        defaultCurrency: 'USD',
        language: 'en',
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
    },
    {
        id: 'profile-3',
        name: 'Bob Johnson',
        avatarUrl: 'https://i.pravatar.cc/150?img=3',
        phone: '+1234567892',
        defaultCurrency: 'USD',
        language: 'en',
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-03'),
    },
];

/**
 * Mock Groups
 */
export const groups: Group[] = [
    {
        id: 'group-1',
        name: 'Weekend Trip',
        description: 'Our amazing weekend getaway',
        imageUrl: 'https://picsum.photos/200/200?random=1',
        groupType: 'trip',
        defaultCurrency: 'USD',
        createdBy: 'profile-1',
        isActive: true,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10'),
    },
    {
        id: 'group-2',
        name: 'Roommates',
        description: 'Apartment expenses',
        imageUrl: 'https://picsum.photos/200/200?random=2',
        groupType: 'home',
        defaultCurrency: 'USD',
        createdBy: 'profile-1',
        isActive: true,
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-05'),
    },
    {
        id: 'group-3',
        name: 'Office Lunch',
        description: 'Daily lunch expenses',
        imageUrl: 'https://picsum.photos/200/200?random=3',
        groupType: 'general',
        defaultCurrency: 'USD',
        createdBy: 'profile-2',
        isActive: true,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
    },
];

/**
 * Mock Group Members (junction table)
 */
export const groupMembers: GroupMember[] = [
    // Weekend Trip - 3 members
    {
        id: 'gm-1',
        groupId: 'group-1',
        userId: 'profile-1',
        joinedAt: new Date('2024-01-10'),
        isActive: true,
    },
    {
        id: 'gm-2',
        groupId: 'group-1',
        userId: 'profile-2',
        joinedAt: new Date('2024-01-10'),
        isActive: true,
    },
    {
        id: 'gm-3',
        groupId: 'group-1',
        userId: 'profile-3',
        joinedAt: new Date('2024-01-10'),
        isActive: true,
    },
    // Roommates - 2 members
    {
        id: 'gm-4',
        groupId: 'group-2',
        userId: 'profile-1',
        joinedAt: new Date('2024-01-05'),
        isActive: true,
    },
    {
        id: 'gm-5',
        groupId: 'group-2',
        userId: 'profile-2',
        joinedAt: new Date('2024-01-05'),
        isActive: true,
    },
    // Office Lunch - 3 members
    {
        id: 'gm-6',
        groupId: 'group-3',
        userId: 'profile-1',
        joinedAt: new Date('2024-01-15'),
        isActive: true,
    },
    {
        id: 'gm-7',
        groupId: 'group-3',
        userId: 'profile-2',
        joinedAt: new Date('2024-01-15'),
        isActive: true,
    },
    {
        id: 'gm-8',
        groupId: 'group-3',
        userId: 'profile-3',
        joinedAt: new Date('2024-01-15'),
        isActive: true,
    },
];

/**
 * Mock Expenses
 */
export const expenses: Expense[] = [
    {
        id: 'expense-1',
        groupId: 'group-1',
        description: 'Hotel booking',
        amount: 300.00,
        currency: 'USD',
        category: 'accommodation',
        expenseDate: new Date('2024-01-20'),
        paidBy: 'profile-1',
        createdBy: 'profile-1',
        isDeleted: false,
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20'),
    },
    {
        id: 'expense-2',
        groupId: 'group-1',
        description: 'Dinner at restaurant',
        amount: 120.00,
        currency: 'USD',
        category: 'food',
        expenseDate: new Date('2024-01-21'),
        paidBy: 'profile-2',
        createdBy: 'profile-2',
        isDeleted: false,
        createdAt: new Date('2024-01-21'),
        updatedAt: new Date('2024-01-21'),
    },
    {
        id: 'expense-3',
        groupId: 'group-2',
        description: 'Electricity bill',
        amount: 80.00,
        currency: 'USD',
        category: 'utilities',
        expenseDate: new Date('2024-01-15'),
        paidBy: 'profile-1',
        createdBy: 'profile-1',
        isDeleted: false,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
    },
    {
        id: 'expense-4',
        groupId: 'group-3',
        description: 'Pizza lunch',
        amount: 45.00,
        currency: 'USD',
        category: 'food',
        expenseDate: new Date('2024-01-22'),
        paidBy: 'profile-3',
        createdBy: 'profile-3',
        isDeleted: false,
        createdAt: new Date('2024-01-22'),
        updatedAt: new Date('2024-01-22'),
    },
];

/**
 * Mock Expense Splits
 * Defines how each expense is split among participants
 */
export const expenseSplits: ExpenseSplit[] = [
    // Expense 1: Hotel $300 split equally among 3 people
    {
        id: 'split-1',
        expenseId: 'expense-1',
        userId: 'profile-1',
        amount: 100.00,
        createdAt: new Date('2024-01-20'),
    },
    {
        id: 'split-2',
        expenseId: 'expense-1',
        userId: 'profile-2',
        amount: 100.00,
        createdAt: new Date('2024-01-20'),
    },
    {
        id: 'split-3',
        expenseId: 'expense-1',
        userId: 'profile-3',
        amount: 100.00,
        createdAt: new Date('2024-01-20'),
    },
    // Expense 2: Dinner $120 split equally among 3 people
    {
        id: 'split-4',
        expenseId: 'expense-2',
        userId: 'profile-1',
        amount: 40.00,
        createdAt: new Date('2024-01-21'),
    },
    {
        id: 'split-5',
        expenseId: 'expense-2',
        userId: 'profile-2',
        amount: 40.00,
        createdAt: new Date('2024-01-21'),
    },
    {
        id: 'split-6',
        expenseId: 'expense-2',
        userId: 'profile-3',
        amount: 40.00,
        createdAt: new Date('2024-01-21'),
    },
    // Expense 3: Electricity $80 split equally between 2 people
    {
        id: 'split-7',
        expenseId: 'expense-3',
        userId: 'profile-1',
        amount: 40.00,
        createdAt: new Date('2024-01-15'),
    },
    {
        id: 'split-8',
        expenseId: 'expense-3',
        userId: 'profile-2',
        amount: 40.00,
        createdAt: new Date('2024-01-15'),
    },
    // Expense 4: Pizza $45 split equally among 3 people
    {
        id: 'split-9',
        expenseId: 'expense-4',
        userId: 'profile-1',
        amount: 15.00,
        createdAt: new Date('2024-01-22'),
    },
    {
        id: 'split-10',
        expenseId: 'expense-4',
        userId: 'profile-2',
        amount: 15.00,
        createdAt: new Date('2024-01-22'),
    },
    {
        id: 'split-11',
        expenseId: 'expense-4',
        userId: 'profile-3',
        amount: 15.00,
        createdAt: new Date('2024-01-22'),
    },
];

/**
 * Mock Settlements
 * Records debt payments between users
 */
export const settlements: Settlement[] = [
    {
        id: 'settlement-1',
        groupId: 'group-1',
        fromUserId: 'profile-2',  // Profile-2 pays Profile-1
        toUserId: 'profile-1',
        amount: 50.00,
        currency: 'USD',
        settlementDate: new Date('2024-01-25'),
        paymentMethod: 'bank_transfer',
        createdBy: 'profile-2',
        createdAt: new Date('2024-01-25'),
    },
    {
        id: 'settlement-2',
        groupId: 'group-2',
        fromUserId: 'profile-2',  // Profile-2 pays Profile-1
        toUserId: 'profile-1',
        amount: 30.00,
        currency: 'USD',
        settlementDate: new Date('2024-01-26'),
        paymentMethod: 'cash',
        createdBy: 'profile-2',
        createdAt: new Date('2024-01-26'),
    },
];

/**
 * Legacy export for backward compatibility
 * @deprecated Use profiles instead
 */
export const users = profiles;
