import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, ActivityIndicator } from 'react-native';
import * as Linking from 'expo-linking';
import Toast from 'react-native-toast-message';
import { handleAuthRedirectUrl, isAuthCallbackUrl } from './services/auth.service';
import { AppNavigator } from './navigation/AppNavigator';
import { LoginScreen } from './screens/auth/LoginScreen';
import { initializeLanguage } from './i18n';
import { supabase } from './lib/supabase';
import { useAppStore } from './store';
import { colors } from './theme';
import './i18n';
import './global.css';

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const { session, setSession } = useAppStore();
  const incomingUrl = Linking.useURL();

  useEffect(() => {
    if (!incomingUrl || session || !isAuthCallbackUrl(incomingUrl)) return;
    void handleAuthRedirectUrl(incomingUrl).then(({ error }) => {
      if (error) console.error('Deep link auth error:', error.message);
    });
  }, [incomingUrl, session]);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        await initializeLanguage();
        const { data } = await supabase.auth.getSession();
        if (mounted) setSession(data.session);
      } catch (e) {
        console.error('Init error:', e);
      } finally {
        if (mounted) setIsReady(true);
      }
    };

    void init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (!isReady) {
    return (
      <SafeAreaProvider>
        <View className="flex-1 justify-center items-center bg-white">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaProvider>
    );
  }

  // Show login outside NavigationContainer so it doesn't conflict with the tab navigator
  if (!session) {
    return (
      <SafeAreaProvider>
        <LoginScreen />
        <Toast />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
      <Toast />
    </SafeAreaProvider>
  );
}
