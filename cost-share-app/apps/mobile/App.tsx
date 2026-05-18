/**
 * Main App Component
 * Entry point for the mobile application
 */

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, ActivityIndicator } from 'react-native';
import { AppNavigator } from './navigation/AppNavigator';
import { initializeLanguage } from './i18n';
import { colors } from './theme';
import './i18n'; // Initialize i18n
import './global.css'; // Import NativeWind styles

export default function App() {
  const [isLanguageLoaded, setIsLanguageLoaded] = useState(false);

  useEffect(() => {
    // Load saved language preference on app start
    const loadLanguage = async () => {
      await initializeLanguage();
      setIsLanguageLoaded(true);
    };

    void loadLanguage();
  }, []);

  // Show loading screen while language is being loaded
  if (!isLanguageLoaded) {
    return (
      <SafeAreaProvider>
        <View className="flex-1 justify-center items-center bg-white">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
