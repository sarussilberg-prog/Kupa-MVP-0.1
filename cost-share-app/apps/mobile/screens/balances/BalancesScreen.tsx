/**
 * BalancesScreen
 * Displays user balances and simplified debts for a group
 * NO business logic - only UI composition
 */

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRoute, RouteProp } from '@react-navigation/native';
import { getGroupBalances, getGroupDebts } from '../../services/groups.service';
import { useLoading } from '../../hooks/useLoading';
import { LoadingIndicator } from '../../components/LoadingIndicator';
import { UserBalance, DebtSummary } from '@cost-share/shared';
import { colors } from '../../theme/colors';

type RootStackParamList = {
    Balances: { groupId: string };
};

type BalancesScreenRouteProp = RouteProp<RootStackParamList, 'Balances'>;

export function BalancesScreen() {
    const { t } = useTranslation();
    const route = useRoute<BalancesScreenRouteProp>();
    const { groupId } = route.params;

    const { isLoading, startLoading, stopLoading } = useLoading();
    const [balances, setBalances] = useState<UserBalance[]>([]);
    const [debts, setDebts] = useState<DebtSummary[]>([]);
    const [activeTab, setActiveTab] = useState<'balances' | 'debts'>('balances');

    useEffect(() => {
        loadBalancesData();
    }, [groupId]);

    const loadBalancesData = async () => {
        startLoading();

        const [balancesData, debtsData] = await Promise.all([
            getGroupBalances(groupId),
            getGroupDebts(groupId),
        ]);

        setBalances(balancesData);
        setDebts(debtsData);

        stopLoading();
    };

    const renderBalance = ({ item }: { item: UserBalance }) => {
        const isPositive = item.netBalance > 0;
        const isZero = Math.abs(item.netBalance) < 0.01;

        return (
            <View className="bg-white p-4 mb-2 rounded-lg shadow">
                <View className="flex-row justify-between items-center mb-3">
                    <Text className="text-base font-semibold text-gray-900">
                        {item.userId}
                    </Text>
                    <View className="items-end">
                        <Text
                            className="text-xl font-bold"
                            style={{
                                color: isZero
                                    ? colors.gray500
                                    : isPositive
                                        ? colors.success
                                        : colors.error,
                            }}
                        >
                            {item.currency} {Math.abs(item.netBalance).toFixed(2)}
                        </Text>
                        <Text className="text-xs text-gray-500 mt-1">
                            {isZero
                                ? 'Settled up'
                                : isPositive
                                    ? 'Gets back'
                                    : 'Owes'}
                        </Text>
                    </View>
                </View>

                {/* Detailed breakdown */}
                <View className="pt-3 border-t border-gray-200">
                    <View className="flex-row justify-between mb-1">
                        <Text className="text-sm text-gray-600">Paid:</Text>
                        <Text className="text-sm text-gray-900">
                            {item.currency} {item.totalPaid.toFixed(2)}
                        </Text>
                    </View>
                    <View className="flex-row justify-between mb-1">
                        <Text className="text-sm text-gray-600">Owes:</Text>
                        <Text className="text-sm text-gray-900">
                            {item.currency} {item.totalOwed.toFixed(2)}
                        </Text>
                    </View>
                    {item.totalSettledPaid > 0 && (
                        <View className="flex-row justify-between mb-1">
                            <Text className="text-sm text-gray-600">Settled (paid):</Text>
                            <Text className="text-sm text-gray-900">
                                {item.currency} {item.totalSettledPaid.toFixed(2)}
                            </Text>
                        </View>
                    )}
                    {item.totalSettledReceived > 0 && (
                        <View className="flex-row justify-between">
                            <Text className="text-sm text-gray-600">Settled (received):</Text>
                            <Text className="text-sm text-gray-900">
                                {item.currency} {item.totalSettledReceived.toFixed(2)}
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        );
    };

    const renderDebt = ({ item }: { item: DebtSummary }) => {
        return (
            <View className="bg-white p-4 mb-2 rounded-lg shadow">
                <View className="flex-row items-center">
                    <View className="flex-1">
                        <Text className="text-base text-gray-900">
                            <Text className="font-semibold">{item.fromUserName}</Text>
                            <Text className="text-gray-600"> owes </Text>
                            <Text className="font-semibold">{item.toUserName}</Text>
                        </Text>
                    </View>
                    <View className="items-end">
                        <Text className="text-xl font-bold" style={{ color: colors.primary }}>
                            {item.currency} {item.amount.toFixed(2)}
                        </Text>
                    </View>
                </View>

                {/* Settle Up Button */}
                <TouchableOpacity
                    className="mt-3 p-3 rounded-lg border-2"
                    style={{ borderColor: colors.primary }}
                >
                    <Text
                        className="text-center font-semibold"
                        style={{ color: colors.primary }}
                    >
                        {t('groups.settleUp')}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    if (isLoading) {
        return <LoadingIndicator />;
    }

    return (
        <View className="flex-1 bg-gray-50">
            {/* Tab Selector */}
            <View className="bg-white p-2 flex-row shadow">
                <TouchableOpacity
                    onPress={() => setActiveTab('balances')}
                    className="flex-1 p-3 rounded-lg"
                    style={{
                        backgroundColor:
                            activeTab === 'balances' ? colors.primary : 'transparent',
                    }}
                >
                    <Text
                        className="text-center font-semibold"
                        style={{
                            color: activeTab === 'balances' ? 'white' : colors.gray600,
                        }}
                    >
                        {t('groups.balances')}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setActiveTab('debts')}
                    className="flex-1 p-3 rounded-lg"
                    style={{
                        backgroundColor:
                            activeTab === 'debts' ? colors.primary : 'transparent',
                    }}
                >
                    <Text
                        className="text-center font-semibold"
                        style={{
                            color: activeTab === 'debts' ? 'white' : colors.gray600,
                        }}
                    >
                        Simplified Debts
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Content */}
            <View className="flex-1 p-4">
                {activeTab === 'balances' ? (
                    balances.length === 0 ? (
                        <View className="flex-1 justify-center items-center">
                            <Text className="text-gray-500 text-center">
                                No balance data available
                            </Text>
                        </View>
                    ) : (
                        <FlatList
                            data={balances}
                            renderItem={renderBalance}
                            keyExtractor={(item) => item.userId}
                            showsVerticalScrollIndicator={false}
                        />
                    )
                ) : debts.length === 0 ? (
                    <View className="flex-1 justify-center items-center">
                        <Text className="text-gray-500 text-center text-lg mb-2">
                            🎉 All settled up!
                        </Text>
                        <Text className="text-gray-400 text-center">
                            No outstanding debts in this group
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={debts}
                        renderItem={renderDebt}
                        keyExtractor={(item, index) => `${item.fromUserId}-${item.toUserId}-${index}`}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>
        </View>
    );
}
