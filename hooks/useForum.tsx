import { useForumContext } from "@/contexts/forum.context";
import { useFetch } from "./useFetch";

export interface ForumTag {
    id: string;
    name: string;
    createdAt: string;
    _count?: { topics: number };
}

export interface Topic {
    id: string;
    title: string;
    content: string;
    viewCount: number;
    createdAt: string;
    authorId: string;
    author: {
        id: string;
        name: string;
        email?: string;
    };
    tags: {
        tag: ForumTag;
    }[];
    _count: {
        comments: number;
    };
}

export interface Comment {
    id: string;
    content: string;
    createdAt: string;
    topicId: string;
    authorId: string;
    author: {
        id: string;
        name: string;
    };
}

export interface TopicDetail extends Topic {
    comments: Comment[];
}

export interface CreateTopicPayload {
    title: string;
    content: string;
    tagIds: string[];
}

export interface AddCommentPayload {
    content: string;
}

export interface CreateTagPayload {
    name: string;
}

export function useForum() {
    const { tags, setTags, topics, setTopics } = useForumContext();
    const { httpClient } = useFetch(undefined);

    async function loadTags(): Promise<"Success" | "Failure"> {
        if (tags.length > 0) return "Success";
        
        const http = await httpClient;
        const response = await http.get("/api/tags");
        if (response.status !== "Failure") {
            setTags(response.payload as ForumTag[]);
        }
        return response.status;
    }

    async function loadTopics(tagId?: string): Promise<"Success" | "Failure"> {
        const http = await httpClient;
        const url = tagId ? `/api/topics?tagId=${tagId}` : "/api/topics";
        const response = await http.get(url);
        if (response.status !== "Failure") {
            setTopics(response.payload as Topic[]);
        }
        return response.status;
    }

    async function loadTopicById(topicId: string): Promise<TopicDetail | null> {
        const http = await httpClient;
        const response = await http.get(`/api/topic/${topicId}`);
        if (response.status !== "Failure") {
            return response.payload as TopicDetail;
        }
        return null;
    }

    async function createTopic(
        title: string,
        content: string,
        tagIds: string[]
    ): Promise<"Success" | "Failure"> {
        const payload: CreateTopicPayload = { title, content, tagIds };
        const http = await httpClient;
        const response = await http.post("/api/topic", payload);
        if (response.status !== "Failure") {
            const newTopic = response.payload as Topic;
            setTopics([newTopic, ...topics]);
        }
        return response.status;
    }

    async function addComment(
        topicId: string,
        content: string
    ): Promise<Comment | null> {
        const payload: AddCommentPayload = { content };
        const http = await httpClient;
        const response = await http.post(`/api/topic/${topicId}/comment`, payload);
        if (response.status !== "Failure") {
            return response.payload as Comment;
        }
        return null;
    }

    async function createTag(name: string): Promise<"Success" | "Failure"> {
        const payload: CreateTagPayload = { name };
        const http = await httpClient;
        const response = await http.post("/api/tag", payload);
        if (response.status !== "Failure") {
            const newTag = response.payload as ForumTag;
            setTags([...tags, newTag]);
        }
        return response.status;
    }

    return {
        loadTags,
        loadTopics,
        loadTopicById,
        createTopic,
        addComment,
        createTag,
    };
}
