/**
 * Groups Service
 * Business logic for group operations
 * ALL group mutations must go through this service
 */

import { Group, CreateGroupDto, ApiResponse } from '@cost-share/shared';
import { apiGet, apiPost } from './api';
import { useAppStore } from '../store';

/**
 * Fetch all groups from API
 */
export async function fetchGroups(): Promise<Group[]> {
    const response = await apiGet<Group[]>('/groups');

    if (response.success && response.data) {
        // Update store
        useAppStore.getState().setGroups(response.data);
        return response.data;
    }

    return [];
}

/**
 * Create a new group
 * This is the ONLY way to create a group from the UI
 */
export async function createGroup(dto: CreateGroupDto): Promise<Group | null> {
    const response = await apiPost<Group>('/groups', dto);

    if (response.success && response.data) {
        // Update store
        useAppStore.getState().addGroup(response.data);
        return response.data;
    }

    return null;
}

/**
 * Get group by ID
 */
export async function getGroupById(id: string): Promise<Group | null> {
    const response = await apiGet<Group>(`/groups/${id}`);

    if (response.success && response.data) {
        return response.data;
    }

    return null;
}
