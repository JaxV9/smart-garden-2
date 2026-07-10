import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { router, usePathname } from 'expo-router';

import { useVegetablesContext } from '@/contexts/vegetables.context';
import { useUserContext } from '@/contexts/user.context';

export interface ElementLayout {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface TourContextType {
    visible: boolean;
    step: number;
    elements: Record<string, ElementLayout>;
    registerElement: (key: string, layout: ElementLayout) => void;
    startTour: () => void;
    nextStep: () => void;
    prevStep: () => void;
    skipTour: () => void;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

import { Platform } from 'react-native';

const getTourCompleted = async () => {
    if (typeof window === 'undefined') return null;
    if (Platform.OS === 'web') {
        return localStorage.getItem('app_tour_completed');
    }
    return await SecureStore.getItemAsync('app_tour_completed');
};

const setTourCompleted = async (val: string) => {
    if (typeof window === 'undefined') return;
    if (Platform.OS === 'web') {
        localStorage.setItem('app_tour_completed', val);
        return;
    }
    await SecureStore.setItemAsync('app_tour_completed', val);
};

export const TourProvider = ({ children }: { children: React.ReactNode }) => {
    const [visible, setVisible] = useState(false);
    const [step, setStep] = useState<-1 | number>(-1);
    const [elements, setElements] = useState<Record<string, ElementLayout>>({});
    const pathname = usePathname();
    const { vegetablesContext } = useVegetablesContext();
    const { isLogin, user } = useUserContext();

    // Check tour completion status
    useEffect(() => {
        const checkTour = async () => {
            const isAuthOrOnboardingPath = 
                pathname.startsWith('/starting') || 
                pathname.startsWith('/login') || 
                pathname.startsWith('/register') || 
                pathname.startsWith('/onboarding') ||
                pathname === '/';

            if (!isLogin || !user || user.level === null || isAuthOrOnboardingPath) {
                setVisible(false);
                return;
            }

            let completed = null;
            try {
                completed = await getTourCompleted();
            } catch (e) {
                console.error("Failed to read app_tour_completed:", e);
            }

            if (completed === 'false' || !completed) {
                setVisible(prev => {
                    if (!prev) {
                        setStep(-1);
                    }
                    return true;
                });
            } else {
                setVisible(false);
            }
        };
        checkTour();
    }, [pathname, isLogin, user]);

    const registerElement = (key: string, layout: ElementLayout) => {
        setElements(prev => ({
            ...prev,
            [key]: layout
        }));
    };

    const startTour = async () => {
        await setTourCompleted('false');
        setStep(-1);
        setVisible(true);
        router.replace('/(tabs)/home');
    };

    const skipTour = async () => {
        await setTourCompleted('true');
        setStep(-1);
        setVisible(false);
        router.replace('/(tabs)/home');
    };

    const routeForStep = (stepIdx: number): string => {
        if (stepIdx <= 2) return '/(tabs)/home';
        if (stepIdx === 3) return '/taches';
        if (stepIdx === 4) return '/(tabs)/home';
        if (stepIdx === 5) return '/calendar';
        if (stepIdx === 6) return '/(tabs)/home';
        if (stepIdx === 7) return '/capteurs';
        if (stepIdx === 8) return '/(tabs)/home';
        if (stepIdx === 9) return '/plan';
        if (stepIdx === 10) return '/(tabs)/plante';
        if (stepIdx === 11) {
            const firstVeg = vegetablesContext && vegetablesContext.length > 0 ? vegetablesContext[0].id : 'tomato';
            return `/vegetable/${firstVeg}`;
        }
        if (stepIdx === 12 || stepIdx === 13) return '/(tabs)/social';
        if (stepIdx === 14 || stepIdx === 15) return '/(tabs)/profile';
        if (stepIdx === 16) return '/profile/personal-info';
        if (stepIdx === 17) return '/profile/community';
        if (stepIdx === 18) return '/profile/garden-info';
        return '/(tabs)/home';
    };

    const nextStep = () => {
        const totalSteps = 19;
        if (step === totalSteps - 1) {
            skipTour();
        } else {
            const nextIdx = step + 1;
            setStep(nextIdx);
            const targetRoute = routeForStep(nextIdx);
            router.replace(targetRoute as any);
        }
    };

    const prevStep = () => {
        if (step > 0) {
            const prevIdx = step - 1;
            setStep(prevIdx);
            const targetRoute = routeForStep(prevIdx);
            router.replace(targetRoute as any);
        } else {
            setStep(-1);
            router.replace('/(tabs)/home');
        }
    };

    return (
        <TourContext.Provider value={{
            visible,
            step,
            elements,
            registerElement,
            startTour,
            nextStep,
            prevStep,
            skipTour
        }}>
            {children}
        </TourContext.Provider>
    );
};

export const useTour = () => {
    const context = useContext(TourContext);
    if (!context) {
        throw new Error('useTour must be used within a TourProvider');
    }
    return context;
};
