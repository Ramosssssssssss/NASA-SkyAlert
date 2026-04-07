import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language } from '@/constants/i18n';

const DARK_MODE_KEY = '@nasa_skyalert_dark_mode';
const LANGUAGE_KEY = '@nasa_skyalert_language';

interface PreferencesState {
  isDarkMode: boolean;
  language: Language;
  toggleDarkMode: () => void;
  setLanguage: (lang: Language) => void;
}

const PreferencesContext = createContext<PreferencesState | undefined>(undefined);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguageState] = useState<Language>('es');

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const [darkValue, langValue] = await Promise.all([
          AsyncStorage.getItem(DARK_MODE_KEY),
          AsyncStorage.getItem(LANGUAGE_KEY),
        ]);

        if (darkValue === 'true') setIsDarkMode(true);
        if (langValue === 'en' || langValue === 'es') setLanguageState(langValue);
      } catch {
        // defaults are fine
      }
    };

    loadPreferences();
  }, []);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => {
      const next = !prev;
      AsyncStorage.setItem(DARK_MODE_KEY, String(next)).catch(() => {});
      return next;
    });
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    AsyncStorage.setItem(LANGUAGE_KEY, lang).catch(() => {});
  }, []);

  return (
    <PreferencesContext.Provider value={{ isDarkMode, language, toggleDarkMode, setLanguage }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences(): PreferencesState {
  const context = useContext(PreferencesContext);

  if (!context) {
    throw new Error('usePreferences debe usarse dentro de un PreferencesProvider');
  }

  return context;
}
