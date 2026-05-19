/**
 * GroupCard Component
 * Reusable group list item card
 * Uses NativeWind styling only, supports i18n
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Group } from '@cost-share/shared';

interface GroupCardProps {
    group: Group;
    memberCount?: number;
    onPress: (groupId: string) => void;
}

const groupTypeEmoji: Record<string, string> = {
    trip: '✈️',
    home: '🏠',
    couple: '💑',
    general: '👥',
    other: '📋',
};

export function GroupCard({ group, memberCount, onPress }: GroupCardProps) {
    const { t } = useTranslation();

    return (
        <TouchableOpacity
            onPress={() => onPress(group.id)}
            activeOpacity={0.7}
            className="bg-white rounded-2xl p-4 mb-3 border border-gray-100"
        >
            <View className="flex-row items-center">
                {/* Group Icon */}
                <View className="w-12 h-12 rounded-xl bg-primary-extra-light justify-center items-center mr-3">
                    <Text className="text-xl">
                        {groupTypeEmoji[group.groupType] || '👥'}
                    </Text>
                </View>

                {/* Group Info */}
                <View className="flex-1">
                    <Text className="text-base font-semibold text-gray-900">
                        {group.name}
                    </Text>
                    {group.description && (
                        <Text className="text-sm text-gray-500 mt-0.5" numberOfLines={1}>
                            {group.description}
                        </Text>
                    )}
                    <View className="flex-row items-center mt-1">
                        <Text className="text-xs text-gray-400">
                            {t(`groups.types.${group.groupType}`)}
                        </Text>
                        {memberCount !== undefined && (
                            <Text className="text-xs text-gray-400 ml-2">
                                • {memberCount} {t('groups.members')}
                            </Text>
                        )}
                    </View>
                </View>

                {/* Arrow */}
                <Text className="text-gray-300 text-lg">›</Text>
            </View>
        </TouchableOpacity>
    );
}
