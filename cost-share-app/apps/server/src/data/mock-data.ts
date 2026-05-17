/**
 * Mock in-memory database
 * Simulates a relational database structure without persistence
 */

import { User, Group, Expense } from '@cost-share/shared';

/**
 * Mock Users
 */
export const users: User[] = [
    {
        id: 'user-1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        avatarUrl: 'https://i.pravatar.cc/150?img=1',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
    },
    {
        id: 'user-2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+1234567891',
        avatarUrl: 'https://i.pravatar.cc/150?img=2',
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
    },
    {
        id: 'user-3',
        name: 'Bob Johnson',
        email: 'bob@example.com',
        phone: '+1234567892',
        avatarUrl: 'https://i.pravatar.cc/150?img=3',
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
        memberIds: ['user-1', 'user-2', 'user-3'],
        createdBy: 'user-1',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10'),
    },
    {
        id: 'group-2',
        name: 'Roommates',
        description: 'Apartment expenses',
        imageUrl: 'https://picsum.photos/200/200?random=2',
        memberIds: ['user-1', 'user-2'],
        createdBy: 'user-1',
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-05'),
    },
    {
        id: 'group-3',
        name: 'Office Lunch',
        description: 'Daily lunch expenses',
        imageUrl: 'https://picsum.photos/200/200?random=3',
        memberIds: ['user-1', 'user-2', 'user-3'],
        createdBy: 'user-2',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
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
        amount: 300,
        currency: 'USD',
        paidBy: 'user-1',
        splitBetween: ['user-1', 'user-2', 'user-3'],
        date: new Date('2024-01-20'),
        category: 'Accommodation',
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20'),
    },
    {
        id: 'expense-2',
        groupId: 'group-1',
        description: 'Dinner at restaurant',
        amount: 120,
        currency: 'USD',
        paidBy: 'user-2',
        splitBetween: ['user-1', 'user-2', 'user-3'],
        date: new Date('2024-01-21'),
        category: 'Food',
        createdAt: new Date('2024-01-21'),
        updatedAt: new Date('2024-01-21'),
    },
    {
        id: 'expense-3',
        groupId: 'group-2',
        description: 'Electricity bill',
        amount: 80,
        currency: 'USD',
        paidBy: 'user-1',
        splitBetween: ['user-1', 'user-2'],
        date: new Date('2024-01-15'),
        category: 'Utilities',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
    },
    {
        id: 'expense-4',
        groupId: 'group-3',
        description: 'Pizza lunch',
        amount: 45,
        currency: 'USD',
        paidBy: 'user-3',
        splitBetween: ['user-1', 'user-2', 'user-3'],
        date: new Date('2024-01-22'),
        category: 'Food',
        createdAt: new Date('2024-01-22'),
        updatedAt: new Date('2024-01-22'),
    },
];
