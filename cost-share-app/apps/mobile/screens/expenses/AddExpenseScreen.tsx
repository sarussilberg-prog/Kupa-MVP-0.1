/**
 * AddExpenseScreen
 * Form to create a new expense with split options
 * NO business logic - only UI composition
 */

import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { getGroupMembers } from '../../services/groups.service';
import { createExpense } from '../../services/expenses.service';
import { useLoading } from '../../hooks/useLoading';
import { LoadingIndicator } from '../../components/LoadingIndicator';
import { CurrencyPicker } from '../../components/CurrencyPicker';
import { useAppStore } from '../../store';
import { GroupMember, CreateExpenseDto, ExpenseCategory } from '@cost-share/shared';
import { colors } from '../../theme/colors';

type RootStackParamList = {
    AddExpense: { groupId: string };
};

type AddExpenseScreenRouteProp = RouteProp<RootStackParamList, 'AddExpense'>;

const EXPENSE_CATEGORIES: ExpenseCategory[] = [
    'food',
    'transport',
    'accommodation',
    'utilities',
    'entertainment',
    'shopping',
    'healthcare',
    'other',
];

export function AddExpenseScreen() {
    const { t } = useTranslation();
    const route = useRoute<AddExpenseScreenRouteProp>();
    const navigation = useNavigation();
    const { groupId } = route.params;
    const { currentUser } = useAppStore();

    const { isLoading, startLoading, stopLoading } = useLoading();
    const [members, setMembers] = useState<GroupMember[]>([]);

    // Form state
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState('USD');
    const [category, setCategory] = useState<ExpenseCategory>('other');
    const [paidBy, setPaidBy] = useState(currentUser?.id || '');
    const [splitEqually, setSplitEqually] = useState(true);
    const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set());

    useEffect(() => {
        loadMembers();
    }, [groupId]);

    const loadMembers = async () => {
        startLoading();
        const membersData = await getGroupMembers(groupId);
        setMembers(membersData);

        // Pre-select all members for equal split
        const allMemberIds = new Set(membersData.map(m => m.userId));
        setSelectedMembers(allMemberIds);

        stopLoading();
    };

    const toggleMemberSelection = (userId: string) => {
        const newSelection = new Set(selectedMembers);
        if (newSelection.has(userId)) {
            newSelection.delete(userId);
        } else {
            newSelection.add(userId);
        }
        setSelectedMembers(newSelection);
    };

    const handleSubmit = async () => {
        // Validation
        if (!description.trim()) {
            alert(t('expenses.description') + ' is required');
            return;
        }

        const amountNum = parseFloat(amount);
        if (isNaN(amountNum) || amountNum <= 0) {
            alert('Invalid amount');
            return;
        }

        if (selectedMembers.size === 0) {
            alert('Select at least one member to split with');
            return;
        }

        startLoading();

        // Build splits
        const splits = Array.from(selectedMembers).map(userId => ({
            userId,
            // If splitEqually is true, don't specify amount (backend will calculate)
            // If false, we'd need custom amounts (not implemented in this basic version)
            ...(splitEqually ? {} : { amount: amountNum / selectedMembers.size }),
        }));

        const dto: CreateExpenseDto = {
            groupId,
            description: description.trim(),
            amount: amountNum,
            currency,
            category,
            paidBy,
            splits,
        };

        const result = await createExpense(dto);
        stopLoading();

        if (result) {
            navigation.goBack();
        }
    };

    if (isLoading && members.length === 0) {
        return <LoadingIndicator />;
    }

    return (
        <ScrollView className="flex-1 bg-gray-50">
            <View className="p-4">
                {/* Description */}
                <View className="mb-4">
                    <Text className="text-sm font-semibold text-gray-700 mb-2">
                        {t('expenses.description')} *
                    </Text>
                    <TextInput
                        value={description}
                        onChangeText={setDescription}
                        placeholder="e.g., Dinner at restaurant"
                        className="bg-white p-3 rounded-lg border border-gray-300"
                    />
                </View>

                {/* Amount */}
                <View className="mb-4">
                    <Text className="text-sm font-semibold text-gray-700 mb-2">
                        {t('expenses.amount')} *
                    </Text>
                    <View className="flex-row">
                        <TextInput
                            value={amount}
                            onChangeText={setAmount}
                            placeholder="0.00"
                            keyboardType="decimal-pad"
                            className="flex-1 bg-white p-3 rounded-lg border border-gray-300 mr-2"
                        />
                        <View className="w-24">
                            <CurrencyPicker
                                value={currency}
                                onChange={setCurrency}
                            />
                        </View>
                    </View>
                </View>

                {/* Category */}
                <View className="mb-4">
                    <Text className="text-sm font-semibold text-gray-700 mb-2">
                        {t('expenses.category')}
                    </Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View className="flex-row">
                            {EXPENSE_CATEGORIES.map((cat) => (
                                <TouchableOpacity
                                    key={cat}
                                    onPress={() => setCategory(cat)}
                                    className="px-4 py-2 rounded-full mr-2"
                                    style={{
                                        backgroundColor: category === cat ? colors.primary : colors.gray200,
                                    }}
                                >
                                    <Text
                                        className="font-medium"
                                        style={{
                                            color: category === cat ? 'white' : colors.gray700,
                                        }}
                                    >
                                        {cat}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                </View>

                {/* Paid By */}
                <View className="mb-4">
                    <Text className="text-sm font-semibold text-gray-700 mb-2">
                        {t('history.paidBy')} *
                    </Text>
                    <View className="bg-white rounded-lg border border-gray-300">
                        {members.map((member) => (
                            <TouchableOpacity
                                key={member.userId}
                                onPress={() => setPaidBy(member.userId)}
                                className="flex-row items-center p-3 border-b border-gray-200"
                            >
                                <View
                                    className="w-5 h-5 rounded-full border-2 mr-3 items-center justify-center"
                                    style={{
                                        borderColor: paidBy === member.userId ? colors.primary : colors.gray400,
                                    }}
                                >
                                    {paidBy === member.userId && (
                                        <View
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: colors.primary }}
                                        />
                                    )}
                                </View>
                                <Text className="text-gray-900">{member.userId}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Split Options */}
                <View className="mb-4">
                    <View className="flex-row justify-between items-center mb-3">
                        <Text className="text-sm font-semibold text-gray-700">
                            Split Equally
                        </Text>
                        <Switch
                            value={splitEqually}
                            onValueChange={setSplitEqually}
                            trackColor={{ false: colors.gray300, true: colors.primaryLight }}
                            thumbColor={splitEqually ? colors.primary : colors.gray400}
                        />
                    </View>

                    <Text className="text-sm font-semibold text-gray-700 mb-2">
                        {t('history.splitBetween')} *
                    </Text>
                    <View className="bg-white rounded-lg border border-gray-300">
                        {members.map((member) => (
                            <TouchableOpacity
                                key={member.userId}
                                onPress={() => toggleMemberSelection(member.userId)}
                                className="flex-row items-center p-3 border-b border-gray-200"
                            >
                                <View
                                    className="w-5 h-5 rounded border-2 mr-3 items-center justify-center"
                                    style={{
                                        borderColor: selectedMembers.has(member.userId)
                                            ? colors.primary
                                            : colors.gray400,
                                        backgroundColor: selectedMembers.has(member.userId)
                                            ? colors.primary
                                            : 'transparent',
                                    }}
                                >
                                    {selectedMembers.has(member.userId) && (
                                        <Text className="text-white text-xs">✓</Text>
                                    )}
                                </View>
                                <Text className="text-gray-900">{member.userId}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={isLoading}
                    className="p-4 rounded-lg mt-4"
                    style={{
                        backgroundColor: isLoading ? colors.gray400 : colors.primary,
                    }}
                >
                    <Text className="text-white text-center font-bold text-lg">
                        {isLoading ? t('common.loading') : t('expenses.addExpense')}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
