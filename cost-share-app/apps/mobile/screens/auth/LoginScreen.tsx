import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { signInWithGoogle } from '../../services/auth.service';

export function LoginScreen() {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        setError(null);
        const { error } = await signInWithGoogle();
        if (error) {
            console.error('Google sign-in error:', error.message);
            setError(`${t('auth.signInError')}\n${error.message}`);
        }
        setIsLoading(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.appName}>Kupa</Text>
            <Text style={styles.subtitle}>{t('auth.subtitle')}</Text>

            {error && <Text style={styles.error}>{error}</Text>}

            <TouchableOpacity
                style={styles.googleButton}
                onPress={handleGoogleSignIn}
                disabled={isLoading}
                activeOpacity={0.85}
            >
                {isLoading ? (
                    <ActivityIndicator size="small" color="#374151" />
                ) : (
                    <Text style={styles.googleButtonText}>
                        {t('auth.signInWithGoogle')}
                    </Text>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        paddingHorizontal: 32,
    },
    appName: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#3B82F6',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
        marginBottom: 64,
        textAlign: 'center',
    },
    error: {
        color: '#EF4444',
        marginBottom: 16,
        textAlign: 'center',
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        paddingVertical: 14,
        paddingHorizontal: 24,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
        minHeight: 52,
    },
    googleButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
    },
});
