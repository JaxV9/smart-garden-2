import { LanguageType, translations } from "@/constants/translations";
import { useFetch } from "@/hooks/useFetch";
import * as SecureStore from "expo-secure-store";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useUserContext } from "./user.context";

interface LanguageContextType {
    language: LanguageType;
    changeLanguage: (lang: LanguageType) => Promise<void>;
    t: (key: string, defaultValue?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

import { Platform } from 'react-native';

const getStoredLanguage = async () => {
    if (typeof window === 'undefined') return null;
    if (Platform.OS === 'web') {
        return localStorage.getItem("app_language");
    }
    return await SecureStore.getItemAsync("app_language");
};

const setStoredLanguage = async (lang: string) => {
    if (typeof window === 'undefined') return;
    if (Platform.OS === 'web') {
        localStorage.setItem("app_language", lang);
        return;
    }
    await SecureStore.setItemAsync("app_language", lang);
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<LanguageType>("fr");
    const { user, setUser } = useUserContext();
    const { httpClient } = useFetch(undefined);

    useEffect(() => {
        const loadLanguage = async () => {
            if (user?.language) {
                const userLang = user.language as LanguageType;
                setLanguage(userLang);
                await setStoredLanguage(userLang);
                return;
            }

            try {
                const storedLang = await getStoredLanguage();
                if (storedLang) {
                    setLanguage(storedLang as LanguageType);
                }
            } catch (err) {
                console.log("Error loading stored language", err);
            }
        };

        loadLanguage();
    }, [user]);

    const changeLanguage = async (newLang: LanguageType) => {
        setLanguage(newLang);
        try {
            await setStoredLanguage(newLang);

            if (user) {
                setUser(prev => prev ? { ...prev, language: newLang } : prev);

                const http = await httpClient;
                await http.put("/api/user", { language: newLang });
            }
        } catch (err) {
            console.log("Error saving language", err);
        }
    };

    const t = (key: string, defaultValue?: string): string => {
        const currentTranslations = translations[language] || translations["fr"];
        return currentTranslations[key] || defaultValue || translations["fr"][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, changeLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useTranslation() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useTranslation must be used within a LanguageProvider");
    }
    return context;
}
