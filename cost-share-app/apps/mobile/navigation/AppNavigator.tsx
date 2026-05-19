/**
 * App Navigator
 * Stack and tab navigation structure
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { GroupsScreen } from '../screens/groups/GroupsScreen';
import { GroupDetailScreen } from '../screens/groups/GroupDetailScreen';
import { AddExpenseScreen } from '../screens/expenses/AddExpenseScreen';
import { BalancesScreen } from '../screens/balances/BalancesScreen';
import { HistoryScreen } from '../screens/history/HistoryScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Groups Stack Navigator
function GroupsStack() {
    const { t } = useTranslation();

    return (
        <Stack.Navigator>
            <Stack.Screen
                name="GroupsList"
                component={GroupsScreen}
                options={{
                    title: t('tabs.groups'),
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="GroupDetail"
                component={GroupDetailScreen}
                options={{
                    title: t('groups.title'),
                }}
            />
            <Stack.Screen
                name="AddExpense"
                component={AddExpenseScreen}
                options={{
                    title: t('expenses.addExpense'),
                }}
            />
            <Stack.Screen
                name="Balances"
                component={BalancesScreen}
                options={{
                    title: t('groups.balances'),
                }}
            />
        </Stack.Navigator>
    );
}

export function AppNavigator() {
    const { t } = useTranslation();

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: '#3B82F6',
                tabBarInactiveTintColor: '#9CA3AF',
                headerShown: false,
            }}
        >
            <Tab.Screen
                name="Groups"
                component={GroupsStack}
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
                    headerShown: true,
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    title: t('tabs.profile'),
                    tabBarLabel: t('tabs.profile'),
                    headerShown: true,
                }}
            />
        </Tab.Navigator>
    );
}
