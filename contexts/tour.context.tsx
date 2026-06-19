import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { router, usePathname } from 'expo-router';

import { useVegetablesContext } from '@/contexts/vegetables.context';

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

export const TourProvider = ({ children }: { children: React.ReactNode }) => {
    const [visible, setVisible] = useState(false);
    const [step, setStep] = useState<-1 | number>(-1);
    const [elements, setElements] = useState<Record<string, ElementLayout>>({});
    const pathname = usePathname();
    const { vegetablesContext } = useVegetablesContext();

    // Check tour completion status
    useEffect(() => {
        const checkTour = async () => {
            const completed = await SecureStore.getItemAsync('app_tour_completed');
            if (completed === 'false' || !completed) {
                setVisible(true);
            } else {
                setVisible(false);
            }
        };
        checkTour();
    }, [pathname]);

    const registerElement = (key: string, layout: ElementLayout) => {
        setElements(prev => ({
            ...prev,
            [key]: layout
        }));
    };

    const startTour = async () => {
        await SecureStore.setItemAsync('app_tour_completed', 'false');
        setStep(-1);
        setVisible(true);
        router.replace('/(tabs)/home');
    };

    const skipTour = async () => {
        await SecureStore.setItemAsync('app_tour_completed', 'true');
        setStep(-1);
        setVisible(false);
        router.replace('/(tabs)/home');
    };

    const routeForStep = (stepIdx: number): string => {
        if (stepIdx <= 5) return '/(tabs)/home';
        if (stepIdx === 6 || stepIdx === 7) return '/taches';
        if (stepIdx === 8) return '/(tabs)/home';
        if (stepIdx === 9) return '/calendar';
        if (stepIdx === 10) return '/(tabs)/home';
        if (stepIdx === 11) return '/capteurs';
        if (stepIdx === 12) return '/(tabs)/home';
        if (stepIdx === 13 || stepIdx === 14) return '/plan';
        if (stepIdx === 15 || stepIdx === 16) return '/(tabs)/plante';
        if (stepIdx === 17 || stepIdx === 18) {
            const firstVeg = vegetablesContext && vegetablesContext.length > 0 ? vegetablesContext[0].id : 'tomato';
            return `/vegetable/${firstVeg}`;
        }
        if (stepIdx === 19 || stepIdx === 20 || stepIdx === 21) return '/(tabs)/social';
        if (stepIdx >= 22 && stepIdx <= 25) return '/(tabs)/profile';
        if (stepIdx === 26 || stepIdx === 27) return '/profile/personal-info';
        if (stepIdx === 28 || stepIdx === 29) return '/profile/community';
        if (stepIdx === 30) return '/profile/garden-info';
        return '/(tabs)/home';
    };

    const nextStep = () => {
        const totalSteps = 31;
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
