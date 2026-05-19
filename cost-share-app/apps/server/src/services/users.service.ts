/**
 * Profiles Service (renamed from Users Service)
 * Business logic for user profile operations
 */

import { Injectable } from '@nestjs/common';
import { Profile, UpdateProfileDto } from '@cost-share/shared';
import { profiles } from '../data/mock-data';

@Injectable()
export class UsersService {
    /**
     * Get all profiles
     */
    findAll(): Profile[] {
        return profiles;
    }

    /**
     * Get profile by ID
     */
    findById(id: string): Profile | undefined {
        return profiles.find(profile => profile.id === id);
    }

    /**
     * Update profile
     * In a real app, this would update the database
     */
    update(id: string, updates: UpdateProfileDto): Profile | undefined {
        const profile = profiles.find(p => p.id === id);
        if (!profile) return undefined;

        Object.assign(profile, updates, { updatedAt: new Date() });
        return profile;
    }

    /**
     * Search profiles by name
     */
    searchByName(query: string): Profile[] {
        const lowerQuery = query.toLowerCase();
        return profiles.filter(p =>
            p.name.toLowerCase().includes(lowerQuery)
        );
    }
}
