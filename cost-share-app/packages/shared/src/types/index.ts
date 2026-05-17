/**
 * Shared TypeScript types for the cost-sharing application
 * These types are used across both frontend (mobile) and backend (server)
 */

/**
 * User entity representing a user in the system
 */
export interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    avatarUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Group entity representing a cost-sharing group
 */
export interface Group {
    id: string;
    name: string;
    description?: string;
    imageUrl?: string;
    memberIds: string[];
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Expense entity representing a shared expense
 */
export interface Expense {
    id: string;
    groupId: string;
    description: string;
    amount: number;
    currency: string;
    paidBy: string; // userId
    splitBetween: string[]; // userIds
    date: Date;
    category?: string;
    imageUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * API Response wrapper for consistent response format
 */
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

/**
 * Create Group DTO
 */
export interface CreateGroupDto {
    name: string;
    description?: string;
    memberIds: string[];
}

/**
 * Create Expense DTO
 */
export interface CreateExpenseDto {
    groupId: string;
    description: string;
    amount: number;
    currency: string;
    paidBy: string;
    splitBetween: string[];
    date?: Date;
    category?: string;
}

/**
 * Update User DTO
 */
export interface UpdateUserDto {
    name?: string;
    email?: string;
    phone?: string;
    avatarUrl?: string;
}

/**
 * Language options for i18n
 */
export type Language = 'en' | 'he';

/**
 * User preferences
 */
export interface UserPreferences {
    language: Language;
    currency: string;
}
