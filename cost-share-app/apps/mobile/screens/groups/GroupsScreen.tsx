/**
 * GroupsScreen
 * Displays list of groups with create group button
 * NO business logic - only UI composition
 */

import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store';
import { fetchGroups } from '../../services/groups.service';
import { colors } from '../../theme';
import { Group } from '@cost-share/shared';

export function GroupsScreen() {
    const { t } = useTranslation();
    const { groups, isLoading, setIsLoading } = useAppStore();

    useEffect(() => {
        loadGroups();
    }, []);

    const loadGroups = async () => {
        setIsLoading(true);
        await fetchGroups();
        setIsLoading(false);
    };

    const handleCreateGroup = () => {
        // Placeholder: Navigate to create group screen
        console.log('Create group pressed');
    };

    const renderGroup = ({ item }: { item: Group }) => (
        <TouchableOpacity className="bg-white p-4 mb-2 rounded-lg shadow">
            <Text className="text-lg font-bold">{item.name}</Text>
            {item.description && (
                <Text className="text-gray-600 mt-1">{item.description}</Text>
            )}
            <Text className="text-sm text-gray-500 mt-2">
                {t('groups.members')}: {item.memberIds.length}
            </Text>
        </TouchableOpacity>
    );

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-50">
                <ActivityIndicator size="large" color={colors.primary} />
                <Text className="mt-4 text-gray-600">{t('common.loading')}</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-50 p-4">
            <FlatList
                data={groups}
                renderItem={renderGroup}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={
                    <View className="flex-1 justify-center items-center py-20">
                        <Text className="text-gray-500 text-lg">{t('groups.noGroups')}</Text>
                    </View>
                }
            />
            <TouchableOpacity
                onPress={handleCreateGroup}
                className="bg-blue-500 p-4 rounded-lg mt-4"
            >
                <Text className="text-white text-center font-bold text-lg">
                    {t('groups.createGroup')}
                </Text>
            </TouchableOpacity>
        </View>
    );
}
