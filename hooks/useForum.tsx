import { useForumContext } from "@/contexts/forum.context";
import { useNotificationContext } from "@/contexts/notification.context";
import { useUserContext } from "@/contexts/user.context";
import { useCallback } from "react";
import { useFetch } from "./useFetch";
import { useTranslation } from "@/contexts/language.context";

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
    const { addNotification } = useNotificationContext();
    const { user } = useUserContext();
    const { t } = useTranslation();

    /**
     * Charge les tags s’ils ne sont pas déjà présents dans le contexte.
     * @returns {Promise<"Success" | "Failure">} Statut de la requête.
     */
    const loadTags = useCallback(async (): Promise<"Success" | "Failure"> => {
        if (tags.length > 0) return "Success";

        const http = await httpClient;
        const response = await http.get("/api/tags");
        if (response.status !== "Failure") {
            setTags(response.payload as ForumTag[]);
        }
        return response.status;
    }, [httpClient, tags.length, setTags]);

    /**
     * Charge la liste des sujets, éventuellement filtrée par tag.
     * @param {string} [tagId] - Identifiant du tag pour filtrer les sujets.
     * @returns {Promise<"Success" | "Failure">} Statut de la requête.
     */
    const loadTopics = useCallback(async (tagId?: string): Promise<"Success" | "Failure"> => {
        const http = await httpClient;
        const url = tagId ? `/api/topics?tagId=${tagId}` : "/api/topics";
        const response = await http.get(url);
        if (response.status !== "Failure") {
            const fetchedTopics = response.payload as Topic[];

            if (topics.length > 0 && user?.id) {
                for (const newTopic of fetchedTopics) {
                    if (newTopic.authorId === user.id || newTopic.author?.id === user.id) {
                        const oldTopic = topics.find(t => t.id === newTopic.id);
                        if (oldTopic) {
                            if (newTopic._count.comments > oldTopic._count.comments) {
                                try {
                                    const topicDetailResponse = await http.get(`/api/topic/${newTopic.id}`);
                                    if (topicDetailResponse.status !== "Failure") {
                                        const topicDetail = topicDetailResponse.payload as TopicDetail;
                                        const foreignComments = topicDetail.comments.filter(c => c.authorId !== user.id && c.author?.id !== user.id);
                                        if (foreignComments.length > 0) {
                                            const newestReply = foreignComments[foreignComments.length - 1];
                                            addNotification(
                                                t("notif_reply_title"),
                                                t("notif_reply_body")
                                                    .replace("{{author}}", newestReply.author?.name || t("social_user_fallback"))
                                                    .replace("{{title}}", newTopic.title)
                                                    .replace("{{content}}", newestReply.content),
                                                "COMMUNITY"
                                            );
                                        }
                                    }
                                } catch (e) {
                                    console.log("Error checking forum reply author:", e);
                                }
                            }
                        }
                    }
                }
            }

            setTopics(fetchedTopics);
        }
        return response.status;
    }, [httpClient, topics, setTopics, user?.id, addNotification, t]);

    /**
     * Récupère les détails d’un sujet (topic) spécifique par son ID.
     * @param {string} topicId - Identifiant du sujet à récupérer.
     * @returns {Promise<TopicDetail | null>} Le sujet complet ou `null` en cas d’échec.
     */
    const loadTopicById = useCallback(async (topicId: string): Promise<TopicDetail | null> => {
        const http = await httpClient;
        const response = await http.get(`/api/topic/${topicId}`);
        if (response.status !== "Failure") {
            return response.payload as TopicDetail;
        }
        return null;
    }, [httpClient]);

    /**
     * Crée un nouveau sujet et l’ajoute à la liste locale.
     * @param {string} title - Titre du sujet.
     * @param {string} content - Contenu du sujet.
     * @param {string[]} tagIds - Liste d’identifiants de tags à associer.
     * @returns {Promise<"Success" | "Failure">} Statut de la requête.
     */
    const createTopic = useCallback(async (
        title: string,
        content: string,
        tagIds: string[]
    ): Promise<"Success" | "Failure"> => {
        const payload: CreateTopicPayload = { title, content, tagIds };
        const http = await httpClient;
        const response = await http.post("/api/topic", payload);
        if (response.status !== "Failure") {
            const newTopic = response.payload as Topic;
            setTopics([newTopic, ...topics]);
            addNotification(
                t("notif_topic_title"),
                t("notif_topic_body").replace("{{title}}", title),
                "COMMUNITY"
            );
        }
        return response.status;
    }, [httpClient, topics, setTopics, addNotification, t]);

    /**
     * Ajoute un commentaire à un sujet donné.
     * @param {string} topicId - Identifiant du sujet.
     * @param {string} content - Contenu du commentaire.
     * @returns {Promise<Comment | null>} Le commentaire ajouté ou `null` si échec.
     */
    const addComment = useCallback(async (
        topicId: string,
        content: string
    ): Promise<Comment | null> => {
        const payload: AddCommentPayload = { content };
        const http = await httpClient;
        const response = await http.post(`/api/topic/${topicId}/comment`, payload);
        if (response.status !== "Failure") {
            const comment = response.payload as Comment;
            addNotification(
                t("notif_reply_posted_title"),
                t("notif_reply_posted_body"),
                "COMMUNITY"
            );
            return comment;
        }
        return null;
    }, [httpClient, addNotification, t]);

    /**
     * Crée un nouveau tag et l’ajoute à la liste locale.
     * @param {string} name - Nom du tag.
     * @returns {Promise<"Success" | "Failure">} Statut de la requête.
     */
    const createTag = useCallback(async (name: string): Promise<"Success" | "Failure"> => {
        const payload: CreateTagPayload = { name };
        const http = await httpClient;
        const response = await http.post("/api/tag", payload);
        if (response.status !== "Failure") {
            const newTag = response.payload as ForumTag;
            setTags([...tags, newTag]);
        }
        return response.status;
    }, [httpClient, tags, setTags]);

    /**
     * Récupère les statistiques liées à l’utilisateur (topics, commentaires, etc.).
     * @returns {Promise<UserStats | null>} Les statistiques ou `null` en cas d’échec.
     */
    const getUserStats = useCallback(async (): Promise<UserStats | null> => {
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
    }, [httpClient]);

    /**
     * Récupère les sujets créés par l’utilisateur connecté.
     * @returns {Promise<Topic[]>} Liste de sujets (vide si échec).
     */
    const getUserTopics = useCallback(async (): Promise<Topic[]> => {
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
    }, [httpClient]);

    /**
     * Récupère les commentaires publiés par l’utilisateur connecté.
     * @returns {Promise<UserComment[]>} Liste de commentaires (vide si échec).
     */
    const getUserComments = useCallback(async (): Promise<UserComment[]> => {
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
    }, [httpClient]);

    /**
     * Supprime un sujet et le retire de la liste locale.
     * @param {string} topicId - Identifiant du sujet à supprimer.
     * @returns {Promise<"Success" | "Failure">} Statut de la requête.
     */
    const deleteTopic = useCallback(async (topicId: string): Promise<"Success" | "Failure"> => {
        const http = await httpClient;
        const response = await http.delete(`/api/topic/${topicId}`);
        if (response.status !== "Failure") {
            setTopics(topics.filter(t => t.id !== topicId));
        }
        return response.status;
    }, [httpClient, topics, setTopics]);

    /**
     * Met à jour un sujet (titre, contenu, tags).
     */
    const updateTopic = useCallback(async (
        topicId: string,
        title: string,
        content: string,
        tagIds: string[]
    ): Promise<"Success" | "Failure"> => {
        const http = await httpClient;
        const response = await http.put(`/api/topic/${topicId}`, { title, content, tagIds });
        if (response.status !== "Failure") {
            const updated = response.payload as Topic;
            setTopics(topics.map(t => t.id === topicId ? updated : t));
        }
        return response.status;
    }, [httpClient, topics, setTopics]);

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
        deleteTopic,
        updateTopic,
    };
}
