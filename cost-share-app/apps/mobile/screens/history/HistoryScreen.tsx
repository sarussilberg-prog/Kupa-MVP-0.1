/**
 * HistoryScreen
 * Displays list of expenses grouped by group
 * NO business logic - only UI composition
 */

import React, { useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store';
import { fetchExpenses } from '../../services/expenses.service';
import { colors } from '../../theme';
import { Expense } from '@cost-share/shared';
import { formatCurrency } from '@cost-share/shared';

export function HistoryScreen() {
    const { t } = useTranslation();
    const { expenses, isLoading, setIsLoading } = useAppStore();

    useEffect(() => {
        loadExpenses();
    }, []);

    const loadExpenses = async () => {
        setIsLoading(true);
        await fetchExpenses();
        setIsLoading(false);
    };

    const renderExpense = ({ item }: { item: Expense }) => (
        <View className="bg-white p-4 mb-2 rounded-lg shadow">
            <Text className="text-lg font-bold">{item.description}</Text>
            <Text className="text-xl font-bold text-green-600 mt-2">
                {formatCurrency(item.amount, item.currency)}
            </Text>
            <Text className="text-sm text-gray-600 mt-2">
                {t('history.paidBy')}: {item.paidBy}
            </Text>
            <Text className="text-sm text-gray-600">
                {t('history.splitBetween')}: {item.splitBetween.length} {t('groups.members')}
            </Text>
            {item.category && (
                <Text className="text-sm text-gray-500 mt-1">
                    {item.category}
                </Text>
            )}
            <Text className="text-xs text-gray-400 mt-2">
                {new Date(item.date).toLocaleDateString()}
            </Text>
        </View>
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
                data={expenses}
                renderItem={renderExpense}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={
                    <View className="flex-1 justify-center items-center py-20">
                        <Text className="text-gray-500 text-lg">{t('history.noExpenses')}</Text>
                    </View>
                }
            />
        </View>
    );
}
