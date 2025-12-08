import { ForumTag, Topic } from "@/hooks/useForum";
import { createContext, ReactNode, useContext, useState } from "react";

interface ForumContextType {
    tags: ForumTag[];
    setTags: (tags: ForumTag[]) => void;
    topics: Topic[];
    setTopics: (topics: Topic[]) => void;
}

const ForumContext = createContext<ForumContextType | undefined>(undefined);

export function ForumProvider({ children }: { children: ReactNode }) {
    const [tags, setTags] = useState<ForumTag[]>([]);
    const [topics, setTopics] = useState<Topic[]>([]);

    return (
        <ForumContext.Provider
            value={{
                tags,
                setTags,
                topics,
                setTopics,
            }}
        >
            {children}
        </ForumContext.Provider>
    );
}

export function useForumContext() {
    const context = useContext(ForumContext);
    if (!context) {
        throw new Error("useForumContext must be used within a ForumProvider");
    }
    return context;
}
