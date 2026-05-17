/**
 * App Navigator
 * Bottom tab navigation (WhatsApp-style)
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import { GroupsScreen } from '../screens/groups/GroupsScreen';
import { HistoryScreen } from '../screens/history/HistoryScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator();

export function AppNavigator() {
    const { t } = useTranslation();

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: '#0000ff',
                tabBarInactiveTintColor: '#gray',
                headerShown: true,
            }}
        >
            <Tab.Screen
                name="Groups"
                component={GroupsScreen}
                options={{
                    title: t('tabs.groups'),
                    tabBarLabel: t('tabs.groups'),
                }}
            />
            <Tab.Screen
                name="History"
                component={HistoryScreen}
                options={{
                    title: t('tabs.history'),
                    tabBarLabel: t('tabs.history'),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    title: t('tabs.profile'),
                    tabBarLabel: t('tabs.profile'),
                }}
            />
        </Tab.Navigator>
    );
}
