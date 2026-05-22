import { Post } from '@/hooks/useSocial';
import React, { createContext, ReactNode, useContext, useMemo, useState } from 'react';

interface SocialContextType {
    posts: Post[];
    setPosts: (posts: Post[]) => void;
}

const SocialContext = createContext<SocialContextType | undefined>(undefined);

export const SocialProvider = ({ children }: { children: ReactNode }) => {
    const [posts, setPosts] = useState<Post[]>([]);

    const value = useMemo(() => ({ posts, setPosts }), [posts]);

    return (
        <SocialContext.Provider value={value}>
            {children}
        </SocialContext.Provider>
    );
};

export const useSocialContext = () => {
    const context = useContext(SocialContext);
    if (!context) {
        throw new Error('useSocialContext must be used within SocialProvider');
    }
    return context;
};
