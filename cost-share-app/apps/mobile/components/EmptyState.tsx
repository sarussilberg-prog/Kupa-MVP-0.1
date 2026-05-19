/**
 * EmptyState Component
 * Reusable empty state with icon, title, message, and optional action
 * Uses NativeWind styling only
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Button } from './Button';

interface EmptyStateProps {
    icon?: string;
    title: string;
    message?: string;
    actionTitle?: string;
    onAction?: () => void;
}

export function EmptyState({
    icon,
    title,
    message,
    actionTitle,
    onAction,
}: EmptyStateProps) {
    return (
        <View className="flex-1 justify-center items-center px-8 py-12">
            {icon && (
                <Text className="text-5xl mb-4">{icon}</Text>
            )}
            <Text className="text-xl font-semibold text-gray-800 text-center mb-2">
                {title}
            </Text>
            {message && (
                <Text className="text-base text-gray-500 text-center mb-6">
                    {message}
                </Text>
            )}
            {actionTitle && onAction && (
                <Button
                    title={actionTitle}
                    onPress={onAction}
                    fullWidth={false}
                />
            )}
        </View>
    );
}
