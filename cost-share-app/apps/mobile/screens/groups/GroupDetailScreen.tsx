/**
 * GroupDetailScreen
 * Displays group details, expenses, and balances
 * NO business logic - only UI composition
 */

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
    getGroupById,
    getGroupMembers,
    getGroupSummary,
    getGroupBalances
} from '../../services/groups.service';
import { fetchExpenses } from '../../services/expenses.service';
import { useLoading } from '../../hooks/useLoading';
import { LoadingIndicator } from '../../components/LoadingIndicator';
import { Group, GroupMember, GroupSummary, UserBalance, Expense } from '@cost-share/shared';
import { colors } from '../../theme/colors';

type RootStackParamList = {
    GroupDetail: { groupId: string };
    AddExpense: { groupId: string };
    Balances: { groupId: string };
};

type GroupDetailScreenRouteProp = RouteProp<RootStackParamList, 'GroupDetail'>;
type GroupDetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function GroupDetailScreen() {
    const { t } = useTranslation();
    const route = useRoute<GroupDetailScreenRouteProp>();
    const navigation = useNavigation<GroupDetailScreenNavigationProp>();
    const { groupId } = route.params;

    const { isLoading, startLoading, stopLoading } = useLoading();
    const [group, setGroup] = useState<Group | null>(null);
    const [members, setMembers] = useState<GroupMember[]>([]);
    const [summary, setSummary] = useState<GroupSummary | null>(null);
    const [balances, setBalances] = useState<UserBalance[]>([]);
    const [expenses, setExpenses] = useState<Expense[]>([]);

    useEffect(() => {
        loadGroupData();
    }, [groupId]);

    const loadGroupData = async () => {
        startLoading();

        // Load all group data in parallel
        const [groupData, membersData, summaryData, balancesData, expensesData] = await Promise.all([
            getGroupById(groupId),
            getGroupMembers(groupId),
            getGroupSummary(groupId),
            getGroupBalances(groupId),
            fetchExpenses(groupId),
        ]);

        setGroup(groupData);
        setMembers(membersData);
        setSummary(summaryData);
        setBalances(balancesData);
        setExpenses(expensesData);

        stopLoading();
    };

    const handleAddExpense = () => {
        navigation.navigate('AddExpense', { groupId });
    };

    const handleViewBalances = () => {
        navigation.navigate('Balances', { groupId });
    };

    const renderExpense = ({ item }: { item: Expense }) => {
        const payer = members.find(m => m.userId === item.paidBy);

        return (
            <View className="bg-white p-4 mb-2 rounded-lg shadow">
                <View className="flex-row justify-between items-start">
                    <View className="flex-1">
                        <Text className="text-base font-semibold text-gray-900">
                            {item.description}
                        </Text>
                        <Text className="text-sm text-gray-500 mt-1">
                            {t('history.paidBy')}: {payer?.userId || 'Unknown'}
                        </Text>
                        {item.category && (
                            <Text className="text-xs text-gray-400 mt-1">
                                {item.category}
                            </Text>
                        )}
                    </View>
                    <View className="items-end">
                        <Text className="text-lg font-bold" style={{ color: colors.primary }}>
                            {item.currency} {item.amount.toFixed(2)}
                        </Text>
                        <Text className="text-xs text-gray-400 mt-1">
                            {new Date(item.expenseDate).toLocaleDateString()}
                        </Text>
                    </View>
                </View>
            </View>
        );
    };

    if (isLoading) {
        return <LoadingIndicator />;
    }

    if (!group) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-50">
                <Text className="text-gray-500 text-lg">{t('common.error')}</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-50">
            <ScrollView>
                {/* Group Header */}
                <View className="bg-white p-6 mb-4 shadow">
                    <Text className="text-2xl font-bold text-gray-900 mb-2">
                        {group.name}
                    </Text>
                    {group.description && (
                        <Text className="text-gray-600 mb-3">
                            {group.description}
                        </Text>
                    )}

                    {/* Group Stats */}
                    {summary && (
                        <View className="flex-row justify-around mt-4 pt-4 border-t border-gray-200">
                            <View className="items-center">
                                <Text className="text-2xl font-bold" style={{ color: colors.primary }}>
                                    {summary.memberCount}
                                </Text>
                                <Text className="text-sm text-gray-500 mt-1">
                                    {t('groups.members')}
                                </Text>
                            </View>
                            <View className="items-center">
                                <Text className="text-2xl font-bold" style={{ color: colors.primary }}>
                                    {summary.expenseCount}
                                </Text>
                                <Text className="text-sm text-gray-500 mt-1">
                                    {t('groups.expenses')}
                                </Text>
                            </View>
                            <View className="items-center">
                                <Text className="text-2xl font-bold" style={{ color: colors.primary }}>
                                    {summary.totalSpent.toFixed(2)}
                                </Text>
                                <Text className="text-sm text-gray-500 mt-1">
                                    {summary.defaultCurrency}
                                </Text>
                            </View>
                        </View>
                    )}
                </View>

                {/* Action Buttons */}
                <View className="px-4 mb-4">
                    <TouchableOpacity
                        onPress={handleAddExpense}
                        className="p-4 rounded-lg mb-3"
                        style={{ backgroundColor: colors.primary }}
                    >
                        <Text className="text-white text-center font-bold text-lg">
                            {t('expenses.addExpense')}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleViewBalances}
                        className="bg-white p-4 rounded-lg border-2"
                        style={{ borderColor: colors.primary }}
                    >
                        <Text className="text-center font-bold text-lg" style={{ color: colors.primary }}>
                            {t('groups.balances')}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Recent Expenses */}
                <View className="px-4 mb-4">
                    <Text className="text-lg font-bold text-gray-900 mb-3">
                        {t('groups.expenses')}
                    </Text>

                    {expenses.length === 0 ? (
                        <View className="bg-white p-8 rounded-lg items-center">
                            <Text className="text-gray-500 text-center">
                                {t('history.noExpenses')}
                            </Text>
                        </View>
                    ) : (
                        <FlatList
                            data={expenses.slice(0, 5)} // Show only recent 5
                            renderItem={renderExpense}
                            keyExtractor={(item) => item.id}
                            scrollEnabled={false}
                        />
                    )}
                </View>
            </ScrollView>
        </View>
    );
}
