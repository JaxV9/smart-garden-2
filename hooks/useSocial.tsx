import { useSocialContext } from "@/contexts/social.context";
import { useFetch } from "./useFetch";
import { useCallback } from "react";

/**
 * Représente un post social.
 */
export interface Post {
    id: string;
    content: string;
    images: string[];
    authorId: string;
    author: {
        id: string;
        name?: string;
        email?: string;
    };
    createdAt: string;
    viewCount?: number;
    _count: {
        likes: number;
        comments: number;
    };
    isLikedByUser?: boolean;
}

/**
 * Représente un commentaire sur un post.
 */
export interface PostComment {
    id: string;
    content: string;
    createdAt: string;
    postId: string;
    authorId: string;
    author: {
        id: string;
        name?: string;
    };
}

/**
 * Données envoyées lors de la création d'un post.
 */
export interface CreatePostPayload {
    content: string;
    images: string[];
}

/**
 * Données envoyées lors de l'ajout d'un commentaire à un post.
 */
export interface AddPostCommentPayload {
    content: string;
}

/**
 * Hook personnalisé pour interagir avec les données sociales.
 * Fournit des fonctions de chargement, création et interaction
 * avec les posts et leurs commentaires.
 */
export function useSocial() {
    const { posts, setPosts } = useSocialContext();
    const { httpClient } = useFetch(undefined);

    /**
     * Charge la liste des posts.
     * @returns {Promise<"Success" | "Failure">} Statut de la requête.
     */
    const loadPosts = useCallback(async (): Promise<"Success" | "Failure"> => {
        const http = await httpClient;
        const response = await http.get("/api/posts");
        if (response.status !== "Failure") {
            setPosts(response.payload as Post[]);
        }
        return response.status;
    }, [httpClient, setPosts]);

    /**
     * Crée un nouveau post et l'ajoute à la liste locale.
     * @param {string} content - Contenu du post.
     * @param {string[]} images - Liste d'URLs d'images.
     * @returns {Promise<"Success" | "Failure">} Statut de la requête.
     */
    const createPost = useCallback(async (
        content: string,
        images: string[]
    ): Promise<"Success" | "Failure"> => {
        const payload: CreatePostPayload = { content, images };
        const http = await httpClient;
        const response = await http.post("/api/post", payload);
        if (response.status !== "Failure") {
            const newPost = response.payload as Post;
            setPosts([newPost, ...posts]);
        }
        return response.status;
    }, [httpClient, posts, setPosts]);

    /**
     * Toggle le like sur un post (like/unlike).
     * @param {string} postId - Identifiant du post.
     * @returns {Promise<"Success" | "Failure">} Statut de la requête.
     */
    const toggleLike = useCallback(async (postId: string): Promise<"Success" | "Failure"> => {
        const http = await httpClient;
        const response = await http.post(`/api/post/${postId}/like`, {});
        if (response.status !== "Failure") {
            // Recharger les posts pour mettre à jour les likes
            await loadPosts();
        }
        return response.status;
    }, [httpClient, loadPosts]);

    /**
     * Ajoute un commentaire à un post donné.
     * @param {string} postId - Identifiant du post.
     * @param {string} content - Contenu du commentaire.
     * @returns {Promise<PostComment | null>} Le commentaire ajouté ou `null` si échec.
     */
    const addComment = useCallback(async (
        postId: string,
        content: string
    ): Promise<PostComment | null> => {
        const payload: AddPostCommentPayload = { content };
        const http = await httpClient;
        const response = await http.post(`/api/post/${postId}/comment`, payload);
        if (response.status !== "Failure") {
            return response.payload as PostComment;
        }
        return null;
    }, [httpClient]);

    /**
     * Récupère les commentaires d'un post spécifique.
     * @param {string} postId - Identifiant du post.
     * @returns {Promise<PostComment[]>} Liste de commentaires (vide si échec).
     */
    const loadComments = useCallback(async (postId: string): Promise<PostComment[]> => {
        try {
            const http = await httpClient;
            const response = await http.get(`/api/post/${postId}/comments`);

            if (response.status !== "Failure") {
                return response.payload as PostComment[];
            }
            return [];
        } catch (error) {
            console.error("Erreur loadComments:", error);
            return [];
        }
    }, [httpClient]);

    /**
     * Supprime un post.
     * @param {string} postId - Identifiant du post à supprimer.
     * @returns {Promise<"Success" | "Failure">} Statut de la requête.
     */
    const deletePost = useCallback(async (postId: string): Promise<"Success" | "Failure"> => {
        const http = await httpClient;
        const response = await http.delete(`/api/post/${postId}`);
        if (response.status !== "Failure") {
            setPosts(posts.filter(p => p.id !== postId));
        }
        return response.status;
    }, [httpClient, posts, setPosts]);

    /**
     * Récupère les posts créés par l'utilisateur connecté.
     * @returns {Promise<Post[]>} Liste de posts (vide si échec).
     */
    const getUserPosts = useCallback(async (): Promise<Post[]> => {
        try {
            const http = await httpClient;
            const response = await http.get("/api/user/posts");

            if (response.status !== "Failure") {
                return response.payload as Post[];
            }
            return [];
        } catch (error) {
            console.error("Erreur getUserPosts:", error);
            return [];
        }
    }, [httpClient]);

    /**
     * Incrémente le compteur de vues d'un post.
     * @param {string} postId - Identifiant du post.
     * @returns {Promise<"Success" | "Failure">} Statut de la requête.
     */
    const incrementPostView = useCallback(async (postId: string): Promise<"Success" | "Failure"> => {
        try {
            const http = await httpClient;
            await http.post(`/api/post/${postId}/view`, {});
            
            setPosts(posts.map((post: Post) => 
                post.id === postId 
                    ? { ...post, viewCount: (post.viewCount || 0) + 1 }
                    : post
            ));
            
            return "Success";
        } catch (error) {
            console.log('Erreur incrémentation vues (non critique):', error);
            return "Success";
        }
    }, [httpClient, posts, setPosts]);

    return {
        loadPosts,
        createPost,
        toggleLike,
        addComment,
        loadComments,
        deletePost,
        getUserPosts,
        incrementPostView,
    };
}
