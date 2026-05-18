/**
 * Groups Service
 * Business logic for group operations
 * ALL group mutations must go through this service
 */

import { Group, CreateGroupDto, ApiResponse } from '@cost-share/shared';
import { apiGet, apiPost } from './api';
import { useAppStore } from '../store';
import Toast from 'react-native-toast-message';
import i18n from '../i18n';

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

    // Show error toast
    console.error('Failed to fetch groups:', response.error);
    Toast.show({
        type: 'error',
        text1: i18n.t('groups.loadError'),
        text2: response.error || i18n.t('common.networkError'),
    });

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

        // Show success toast
        Toast.show({
            type: 'success',
            text1: i18n.t('common.success'),
            text2: i18n.t('groups.createGroup'),
        });

        return response.data;
    }

    // Show error toast
    console.error('Failed to create group:', response.error);
    Toast.show({
        type: 'error',
        text1: i18n.t('groups.createError'),
        text2: response.error || i18n.t('common.networkError'),
    });

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
