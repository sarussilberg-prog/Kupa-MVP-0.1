/**
 * i18n Configuration
 * Internationalization setup for English and Hebrew
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager } from 'react-native';
import en from './locales/en.json';
import he from './locales/he.json';

const resources = {
    en: { translation: en },
    he: { translation: he },
};

// Initialize i18n
void i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'en', // default language
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
        compatibilityJSON: 'v4',
    });

/**
 * Change language and update RTL settings
 * Note: RTL changes may require app restart
 */
export const changeLanguage = async (language: 'en' | 'he') => {
    await i18n.changeLanguage(language);
    const isRTL = language === 'he';

    if (I18nManager.isRTL !== isRTL) {
        I18nManager.forceRTL(isRTL);
        // In a real app, you might want to show a message to restart the app
        console.log('RTL setting changed. App restart may be required.');
    }
};

export default i18n;
