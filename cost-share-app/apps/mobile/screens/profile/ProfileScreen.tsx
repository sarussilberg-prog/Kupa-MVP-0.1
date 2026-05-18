/**
 * ProfileScreen
 * User profile with language toggle and logout
 * NO business logic - only UI composition
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store';
import { changeLanguage } from '../../i18n';

export function ProfileScreen() {
    const { t } = useTranslation();
    const { currentUser, language, setLanguage } = useAppStore();
    const [isChangingLanguage, setIsChangingLanguage] = useState(false);

    const handleLanguageChange = async (newLanguage: 'en' | 'he') => {
        if (newLanguage === language) return; // Already selected

        setIsChangingLanguage(true);

        try {
            const needsRestart = await changeLanguage(newLanguage);
            setLanguage(newLanguage);

            // Show restart prompt if RTL changed
            if (needsRestart) {
                Alert.alert(
                    t('profile.restartRequired'),
                    t('profile.restartMessage'),
                    [
                        {
                            text: t('common.ok'),
                            onPress: () => console.log('User acknowledged restart needed'),
                        },
                    ]
                );
            }
        } catch (error) {
            console.error('Failed to change language:', error);
            Alert.alert(
                t('common.error'),
                t('profile.languageChangeError'),
                [{ text: t('common.ok') }]
            );
        } finally {
            setIsChangingLanguage(false);
        }
    };

    const handleLogout = () => {
        Alert.alert(
            t('profile.logout'),
            t('profile.logoutConfirm'),
            [
                { text: t('common.cancel'), style: 'cancel' },
                { text: t('profile.logout'), onPress: () => console.log('Logout') },
            ]
        );
    };

    return (
        <View className="flex-1 bg-gray-50 p-4">
            {/* User Info */}
            <View className="bg-white p-6 rounded-lg shadow mb-4">
                <Text className="text-2xl font-bold mb-2">
                    {currentUser?.name || 'Guest User'}
                </Text>
                <Text className="text-gray-600">
                    {currentUser?.email || 'guest@example.com'}
                </Text>
            </View>

            {/* Language Selection */}
            <View className="bg-white p-4 rounded-lg shadow mb-4">
                <Text className="text-lg font-bold mb-4">{t('profile.language')}</Text>

                <TouchableOpacity
                    onPress={() => handleLanguageChange('en')}
                    className={`p-4 rounded-lg mb-2 ${language === 'en' ? 'bg-blue-500' : 'bg-gray-200'
                        }`}
                >
                    <Text
                        className={`text-center font-bold ${language === 'en' ? 'text-white' : 'text-gray-700'
                            }`}
                    >
                        {t('profile.english')}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => handleLanguageChange('he')}
                    className={`p-4 rounded-lg ${language === 'he' ? 'bg-blue-500' : 'bg-gray-200'
                        }`}
                >
                    <Text
                        className={`text-center font-bold ${language === 'he' ? 'text-white' : 'text-gray-700'
                            }`}
                    >
                        {t('profile.hebrew')}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Logout Button */}
            <TouchableOpacity
                onPress={handleLogout}
                className="bg-red-500 p-4 rounded-lg"
            >
                <Text className="text-white text-center font-bold text-lg">
                    {t('profile.logout')}
                </Text>
            </TouchableOpacity>
        </View>
    );
}
