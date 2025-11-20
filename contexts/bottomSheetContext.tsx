import React, { createContext, useContext, useState, ReactNode } from 'react';

type BottomSheetContextType = {
    show: (content: ReactNode) => void;
    hide: () => void;
    content: ReactNode;
    isActive: boolean;
};

const BottomSheetContext = createContext<BottomSheetContextType | undefined>(undefined);

export const useBottomSheet = () => {
    const context = useContext(BottomSheetContext);
    if (!context) {
        throw new Error('useBottomSheet must be used within a BottomSheetProvider');
    }
    return context;
};

export const BottomSheetProvider = ({ children }: { children: ReactNode }) => {
    const [content, setContent] = useState<ReactNode>(null);
    const [isActive, setIsActive] = useState(false);

    const show = (node: ReactNode) => {
        setContent(node);
        setIsActive(true);
    };

    const hide = () => {
        setIsActive(false);
        setContent(null);
    };

    return (
        <BottomSheetContext.Provider value={{ show, hide, content, isActive }}>
            {children}
        </BottomSheetContext.Provider>
    );
};