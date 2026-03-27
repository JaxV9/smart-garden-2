import { Tutorial } from '@/hooks/useTutorials';
import React, { createContext, ReactNode, useContext, useMemo, useState } from 'react';

interface TutorialsContextType {
    tutorials: Tutorial[];
    setTutorials: (tutorials: Tutorial[]) => void;
}

const TutorialsContext = createContext<TutorialsContextType | undefined>(undefined);

export const TutorialsProvider = ({ children }: { children: ReactNode }) => {
    const [tutorials, setTutorials] = useState<Tutorial[]>([]);

    const value = useMemo(() => ({ tutorials, setTutorials }), [tutorials]);

    return (
        <TutorialsContext.Provider value={value}>
            {children}
        </TutorialsContext.Provider>
    );
};

export const useTutorialsContext = () => {
    const context = useContext(TutorialsContext);
    if (!context) {
        throw new Error('useTutorialsContext must be used within TutorialsProvider');
    }
    return context;
};
