/**
 * Groups Service
 * Business logic for group operations
 */

import { Injectable } from '@nestjs/common';
import { Group, CreateGroupDto } from '@cost-share/shared';
import { groups } from '../data/mock-data';
import { generateId } from '@cost-share/shared';

@Injectable()
export class GroupsService {
    /**
     * Get all groups
     */
    findAll(): Group[] {
        return groups;
    }

    /**
     * Get group by ID
     */
    findById(id: string): Group | undefined {
        return groups.find(group => group.id === id);
    }

    /**
     * Create a new group
     */
    create(dto: CreateGroupDto, createdBy: string): Group {
        const newGroup: Group = {
            id: generateId(),
            name: dto.name,
            description: dto.description,
            memberIds: dto.memberIds,
            createdBy,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        groups.push(newGroup);
        return newGroup;
    }

    /**
     * Get groups by user ID
     */
    findByUserId(userId: string): Group[] {
        return groups.filter(group => group.memberIds.includes(userId));
    }
}
