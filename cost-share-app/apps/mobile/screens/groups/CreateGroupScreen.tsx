/**
 * CreateGroupScreen
 * Form to create a new group with member selection
 */

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { createGroup } from '../../services/groups.service';
import { fetchUsers } from '../../services/users.service';
import { useLoading } from '../../hooks/useLoading';
import { LoadingIndicator } from '../../components/LoadingIndicator';
import { GroupType, User } from '@cost-share/shared';

export function CreateGroupScreen() {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const { isLoading, startLoading, stopLoading } = useLoading();

    // Form state
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [groupType, setGroupType] = useState<GroupType>('general');
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

    // Available users
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        const fetchedUsers = await fetchUsers();
        setUsers(fetchedUsers);
    };

    const toggleMember = (userId: string) => {
        if (selectedMembers.includes(userId)) {
            setSelectedMembers(selectedMembers.filter(id => id !== userId));
        } else {
            setSelectedMembers([...selectedMembers, userId]);
        }
    };

    const handleCreate = async () => {
        // Validation
        if (!name.trim()) {
            Alert.alert('Error', 'Please enter a group name');
            return;
        }

        if (selectedMembers.length === 0) {
            Alert.alert('Error', 'Please select at least one member');
            return;
        }

        startLoading();

        const result = await createGroup({
            name: name.trim(),
            description: description.trim() || undefined,
            groupType,
            memberIds: selectedMembers,
        });

        stopLoading();

        if (result) {
            navigation.goBack();
        }
    };

    if (isLoading) {
        return <LoadingIndicator />;
    }

    const groupTypes: GroupType[] = ['trip', 'home', 'couple', 'general'];

    return (
        <ScrollView className="flex-1 bg-gray-50">
            <View className="p-4">
                {/* Group Name */}
                <View className="mb-4">
                    <Text className="text-sm font-medium text-gray-700 mb-2">
                        {t('groups.groupName')} *
                    </Text>
                    <TextInput
                        className="bg-white border border-gray-300 rounded-lg p-4 text-base"
                        placeholder={t('groups.enterGroupName')}
                        value={name}
                        onChangeText={setName}
                        autoFocus
                    />
                </View>

                {/* Description */}
                <View className="mb-4">
                    <Text className="text-sm font-medium text-gray-700 mb-2">
                        {t('groups.description')}
                    </Text>
                    <TextInput
                        className="bg-white border border-gray-300 rounded-lg p-4 text-base"
                        placeholder={t('groups.enterDescription')}
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={3}
                    />
                </View>

                {/* Group Type */}
                <View className="mb-4">
                    <Text className="text-sm font-medium text-gray-700 mb-2">
                        {t('groups.groupType')}
                    </Text>
                    <View className="flex-row flex-wrap gap-2">
                        {groupTypes.map((type) => (
                            <TouchableOpacity
                                key={type}
                                onPress={() => setGroupType(type)}
                                className={`px-4 py-2 rounded-lg border ${groupType === type
                                    ? 'bg-blue-500 border-blue-500'
                                    : 'bg-white border-gray-300'
                                    }`}
                            >
                                <Text
                                    className={`font-medium ${groupType === type ? 'text-white' : 'text-gray-700'
                                        }`}
                                >
                                    {t(`groups.types.${type}`)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Members Selection */}
                <View className="mb-6">
                    <Text className="text-sm font-medium text-gray-700 mb-2">
                        {t('groups.selectMembers')} *
                    </Text>
                    {users.map((user) => (
                        <TouchableOpacity
                            key={user.id}
                            onPress={() => toggleMember(user.id)}
                            className="bg-white border border-gray-300 rounded-lg p-4 mb-2 flex-row items-center"
                        >
                            <View
                                className={`w-6 h-6 rounded border-2 mr-3 items-center justify-center ${selectedMembers.includes(user.id)
                                    ? 'bg-blue-500 border-blue-500'
                                    : 'border-gray-300'
                                    }`}
                            >
                                {selectedMembers.includes(user.id) && (
                                    <Text className="text-white font-bold">✓</Text>
                                )}
                            </View>
                            <View>
                                <Text className="text-base font-medium">{user.name}</Text>
                                {user.phone && (
                                    <Text className="text-sm text-gray-600">{user.phone}</Text>
                                )}
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Create Button */}
                <TouchableOpacity
                    onPress={handleCreate}
                    className="bg-blue-500 rounded-lg p-4 mb-4"
                    disabled={isLoading}
                >
                    <Text className="text-white text-center font-bold text-lg">
                        {t('groups.createGroup')}
                    </Text>
                </TouchableOpacity>

                {/* Cancel Button */}
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="bg-gray-200 rounded-lg p-4"
                >
                    <Text className="text-gray-700 text-center font-semibold text-lg">
                        {t('common.cancel')}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
