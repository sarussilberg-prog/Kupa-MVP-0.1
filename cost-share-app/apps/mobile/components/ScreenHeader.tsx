/**
 * ScreenHeader Component
 * Consistent screen header with title and optional right action
 * Uses NativeWind styling only
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface ScreenHeaderProps {
    title: string;
    rightLabel?: string;
    onRightPress?: () => void;
    subtitle?: string;
}

export function ScreenHeader({
    title,
    rightLabel,
    onRightPress,
    subtitle,
}: ScreenHeaderProps) {
    return (
        <View className="px-4 pt-2 pb-4">
            <View className="flex-row justify-between items-center">
                <View className="flex-1">
                    <Text className="text-2xl font-bold text-gray-900">
                        {title}
                    </Text>
                    {subtitle && (
                        <Text className="text-sm text-gray-500 mt-1">
                            {subtitle}
                        </Text>
                    )}
                </View>
                {rightLabel && onRightPress && (
                    <TouchableOpacity
                        onPress={onRightPress}
                        activeOpacity={0.7}
                        className="bg-primary rounded-xl px-4 py-2"
                    >
                        <Text className="text-white font-semibold text-sm">
                            {rightLabel}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}
