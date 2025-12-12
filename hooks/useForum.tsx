import { useForumContext } from "@/contexts/forum.context";
import { useFetch } from "./useFetch";

/**
 * Représente un tag (catégorie) de forum.
 */
export interface ForumTag {
    id: string;
    name: string;
    createdAt: string;
    _count?: { topics: number };
}

/**
 * Représente un sujet (topic) du forum.
 */
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

/**
 * Représente un commentaire sur un sujet.
 */
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

/**
 * Représente un sujet complet avec ses commentaires.
 */
export interface TopicDetail extends Topic {
    comments: Comment[];
}

/**
 * Données envoyées à l’API lors de la création d’un topic.
 */
export interface CreateTopicPayload {
    title: string;
    content: string;
    tagIds: string[];
}

/**
 * Données envoyées lors de l’ajout d’un commentaire à un sujet.
 */
export interface AddCommentPayload {
    content: string;
}

/**
 * Données nécessaires à la création d’un nouveau tag.
 */
export interface CreateTagPayload {
    name: string;
}

/**
 * Statistiques liées à un utilisateur.
 */
export interface UserStats {
    topicsCount: number;
    commentsCount: number;
    plantsCount: number;
}

/**
 * Représente un commentaire d’un utilisateur,
 * incluant le sujet associé.
 */
export interface UserComment {
    id: string;
    content: string;
    createdAt: string;
    topicId: string;
    authorId: string;
    author: {
        id: string;
        name: string;
    };
    topic: {
        id: string;
        title: string;
        tags: {
            tag: ForumTag;
        }[];
    };
}

/**
 * Hook personnalisé pour interagir avec les données du forum.
 * Fournit des fonctions de chargement, création et récupération de données
 * liées aux sujets, commentaires, tags et statistiques utilisateur.
 */
export function useForum() {
    const { tags, setTags, topics, setTopics } = useForumContext();
    const { httpClient } = useFetch(undefined);

    /**
     * Charge les tags s’ils ne sont pas déjà présents dans le contexte.
     * @returns {Promise<"Success" | "Failure">} Statut de la requête.
     */
    async function loadTags(): Promise<"Success" | "Failure"> {
        if (tags.length > 0) return "Success";

        const http = await httpClient;
        const response = await http.get("/api/tags");
        if (response.status !== "Failure") {
            setTags(response.payload as ForumTag[]);
        }
        return response.status;
    }

    /**
     * Charge la liste des sujets, éventuellement filtrée par tag.
     * @param {string} [tagId] - Identifiant du tag pour filtrer les sujets.
     * @returns {Promise<"Success" | "Failure">} Statut de la requête.
     */
    async function loadTopics(tagId?: string): Promise<"Success" | "Failure"> {
        const http = await httpClient;
        const url = tagId ? `/api/topics?tagId=${tagId}` : "/api/topics";
        const response = await http.get(url);
        if (response.status !== "Failure") {
            setTopics(response.payload as Topic[]);
        }
        return response.status;
    }

    /**
     * Récupère les détails d’un sujet (topic) spécifique par son ID.
     * @param {string} topicId - Identifiant du sujet à récupérer.
     * @returns {Promise<TopicDetail | null>} Le sujet complet ou `null` en cas d’échec.
     */
    async function loadTopicById(topicId: string): Promise<TopicDetail | null> {
        const http = await httpClient;
        const response = await http.get(`/api/topic/${topicId}`);
        if (response.status !== "Failure") {
            return response.payload as TopicDetail;
        }
        return null;
    }

    /**
     * Crée un nouveau sujet et l’ajoute à la liste locale.
     * @param {string} title - Titre du sujet.
     * @param {string} content - Contenu du sujet.
     * @param {string[]} tagIds - Liste d’identifiants de tags à associer.
     * @returns {Promise<"Success" | "Failure">} Statut de la requête.
     */
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

    /**
     * Ajoute un commentaire à un sujet donné.
     * @param {string} topicId - Identifiant du sujet.
     * @param {string} content - Contenu du commentaire.
     * @returns {Promise<Comment | null>} Le commentaire ajouté ou `null` si échec.
     */
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

    /**
     * Crée un nouveau tag et l’ajoute à la liste locale.
     * @param {string} name - Nom du tag.
     * @returns {Promise<"Success" | "Failure">} Statut de la requête.
     */
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

    /**
     * Récupère les statistiques liées à l’utilisateur (topics, commentaires, etc.).
     * @returns {Promise<UserStats | null>} Les statistiques ou `null` en cas d’échec.
     */
    async function getUserStats(): Promise<UserStats | null> {
        try {
            const http = await httpClient;
            const response = await http.get("/api/stats");

            if (response.status !== "Failure") {
                return response.payload as UserStats;
            }

            return null;
        } catch (error) {
            console.error("Erreur getUserStats:", error);
            return null;
        }
    }

    /**
     * Récupère les sujets créés par l’utilisateur connecté.
     * @returns {Promise<Topic[]>} Liste de sujets (vide si échec).
     */
    async function getUserTopics(): Promise<Topic[]> {
        try {
            const http = await httpClient;
            const response = await http.get("/api/user/topics");

            if (response.status !== "Failure") {
                return response.payload as Topic[];
            }
            return [];
        } catch (error) {
            console.error("Erreur getUserTopics:", error);
            return [];
        }
    }

    /**
     * Récupère les commentaires publiés par l’utilisateur connecté.
     * @returns {Promise<UserComment[]>} Liste de commentaires (vide si échec).
     */
    async function getUserComments(): Promise<UserComment[]> {
        try {
            const http = await httpClient;
            const response = await http.get("/api/user/comments");

            if (response.status !== "Failure") {
                return response.payload as UserComment[];
            }
            return [];
        } catch (error) {
            console.error("Erreur getUserComments:", error);
            return [];
        }
    }

    return {
        loadTags,
        loadTopics,
        loadTopicById,
        createTopic,
        addComment,
        createTag,
        getUserStats,
        getUserTopics,
        getUserComments,
    };
}
