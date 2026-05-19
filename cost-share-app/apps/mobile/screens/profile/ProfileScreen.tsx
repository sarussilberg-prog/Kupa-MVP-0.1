/**
 * ProfileScreen
 * User profile with language toggle and logout
 * Uses NativeWind styling only, full i18n support
 */

import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useAppStore } from '../../store';
import { signOut } from '../../services/auth.service';
import { changeLanguage } from '../../i18n';
import { MemberAvatar } from '../../components/MemberAvatar';
import { Button } from '../../components/Button';
import { ConfirmDialog } from '../../components/ConfirmDialog';

export function ProfileScreen() {
    const { t } = useTranslation();
    const navigation = useNavigation<any>();
    const currentUser = useAppStore((state) => state.currentUser);
    const language = useAppStore((state) => state.language);
    const setLanguage = useAppStore((state) => state.setLanguage);

    const [showLogoutDialog, setShowLogoutDialog] = useState(false);

    const handleLanguageChange = useCallback(
        async (lang: 'en' | 'he') => {
            try {
                const needsRestart = await changeLanguage(lang);
                setLanguage(lang);

                if (needsRestart) {
                    Alert.alert(
                        t('profile.restartRequired'),
                        t('profile.restartMessage'),
                        [{ text: t('common.ok') }]
                    );
                }
            } catch {
                Alert.alert(t('common.error'), t('profile.languageChangeError'));
            }
        },
        [setLanguage, t]
    );

    const handleLogout = useCallback(async () => {
        setShowLogoutDialog(false);
        await signOut();
    }, []);

    const handleEditProfile = useCallback(() => {
        navigation.navigate('EditProfile');
    }, [navigation]);

    return (
        <ScrollView className="flex-1 bg-slate-50">
            {/* Profile Header */}
            <View className="bg-white px-4 py-8 items-center mb-4">
                <MemberAvatar
                    name={currentUser?.name || '?'}
                    avatarUrl={currentUser?.avatarUrl}
                    size="lg"
                />
                <Text className="text-xl font-bold text-gray-900 mt-3">
                    {currentUser?.name || t('common.unknown')}
                </Text>
                <Text className="text-sm text-gray-500 mt-1">
                    {currentUser?.email || ''}
                </Text>
            </View>

            {/* Language Settings */}
            <View className="px-4 mb-4">
                <Text className="text-lg font-semibold text-gray-900 mb-3">
                    {t('profile.language')}
                </Text>
                <View className="flex-row gap-3">
                    <View className="flex-1">
                        <Button
                            title={t('profile.english')}
                            onPress={() => handleLanguageChange('en')}
                            variant={language === 'en' ? 'primary' : 'outline'}
                        />
                    </View>
                    <View className="flex-1">
                        <Button
                            title={t('profile.hebrew')}
                            onPress={() => handleLanguageChange('he')}
                            variant={language === 'he' ? 'primary' : 'outline'}
                        />
                    </View>
                </View>
            </View>

            {/* Actions */}
            <View className="px-4 mb-8 gap-2">
                <Button
                    title={t('profile.editProfile')}
                    onPress={handleEditProfile}
                    variant="outline"
                />
                <Button
                    title={t('profile.logout')}
                    onPress={() => setShowLogoutDialog(true)}
                    variant="danger"
                />
            </View>

            {/* Logout Confirmation */}
            <ConfirmDialog
                visible={showLogoutDialog}
                title={t('profile.logout')}
                message={t('profile.logoutConfirm')}
                confirmText={t('profile.logout')}
                cancelText={t('common.cancel')}
                onConfirm={handleLogout}
                onCancel={() => setShowLogoutDialog(false)}
                destructive
            />
        </ScrollView>
    );
}
