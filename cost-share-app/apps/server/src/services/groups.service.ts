/**
 * Groups Service
 * Business logic for group operations
 */

import { Injectable } from '@nestjs/common';
import { Group, GroupMember, CreateGroupDto, UpdateGroupDto, AddGroupMemberDto } from '@cost-share/shared';
import { groups, groupMembers } from '../data/mock-data';
import { generateId } from '@cost-share/shared';

@Injectable()
export class GroupsService {
    /**
     * Get all groups
     */
    findAll(): Group[] {
        return groups.filter(g => g.isActive);
    }

    /**
     * Get group by ID
     */
    findById(id: string): Group | undefined {
        return groups.find(group => group.id === id && group.isActive);
    }

    /**
     * Create a new group
     * Also creates group memberships for initial members
     */
    create(dto: CreateGroupDto, createdBy: string): Group {
        const newGroup: Group = {
            id: generateId(),
            name: dto.name,
            description: dto.description,
            imageUrl: dto.imageUrl,
            groupType: dto.groupType || 'general',
            defaultCurrency: dto.defaultCurrency || 'USD',
            createdBy,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        groups.push(newGroup);

        // Add creator as member
        const creatorMembership: GroupMember = {
            id: generateId(),
            groupId: newGroup.id,
            userId: createdBy,
            joinedAt: new Date(),
            isActive: true,
        };
        groupMembers.push(creatorMembership);

        // Add other initial members
        for (const memberId of dto.memberIds) {
            if (memberId !== createdBy) { // Don't add creator twice
                const membership: GroupMember = {
                    id: generateId(),
                    groupId: newGroup.id,
                    userId: memberId,
                    joinedAt: new Date(),
                    isActive: true,
                };
                groupMembers.push(membership);
            }
        }

        return newGroup;
    }

    /**
     * Update group
     */
    update(id: string, dto: UpdateGroupDto): Group | undefined {
        const group = groups.find(g => g.id === id && g.isActive);
        if (!group) return undefined;

        Object.assign(group, dto, { updatedAt: new Date() });
        return group;
    }

    /**
     * Soft delete group
     */
    delete(id: string): boolean {
        const group = groups.find(g => g.id === id);
        if (!group) return false;

        group.isActive = false;
        group.updatedAt = new Date();
        return true;
    }

    /**
     * Get groups by user ID
     */
    findByUserId(userId: string): Group[] {
        const userGroupIds = groupMembers
            .filter(gm => gm.userId === userId && gm.isActive)
            .map(gm => gm.groupId);

        return groups.filter(g =>
            userGroupIds.includes(g.id) && g.isActive
        );
    }

    /**
     * Get group members
     */
    getMembers(groupId: string): GroupMember[] {
        return groupMembers.filter(gm =>
            gm.groupId === groupId && gm.isActive
        );
    }

    /**
     * Add member to group
     */
    addMember(dto: AddGroupMemberDto): GroupMember {
        const newMember: GroupMember = {
            id: generateId(),
            groupId: dto.groupId,
            userId: dto.userId,
            joinedAt: new Date(),
            isActive: true,
        };

        groupMembers.push(newMember);
        return newMember;
    }

    /**
     * Remove member from group (soft delete)
     */
    removeMember(groupId: string, userId: string): boolean {
        const membership = groupMembers.find(gm =>
            gm.groupId === groupId &&
            gm.userId === userId &&
            gm.isActive
        );

        if (!membership) return false;

        membership.isActive = false;
        membership.leftAt = new Date();
        return true;
    }
}
