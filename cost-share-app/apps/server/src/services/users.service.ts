/**
 * Users Service
 * Business logic for user operations
 */

import { Injectable } from '@nestjs/common';
import { User } from '@cost-share/shared';
import { users } from '../data/mock-data';

@Injectable()
export class UsersService {
    /**
     * Get all users
     */
    findAll(): User[] {
        return users;
    }

    /**
     * Get user by ID
     */
    findById(id: string): User | undefined {
        return users.find(user => user.id === id);
    }

    /**
     * Update user
     * In a real app, this would update the database
     */
    update(id: string, updates: Partial<User>): User | undefined {
        const user = users.find(u => u.id === id);
        if (!user) return undefined;

        Object.assign(user, updates, { updatedAt: new Date() });
        return user;
    }
}
