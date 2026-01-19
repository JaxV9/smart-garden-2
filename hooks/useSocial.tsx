import { useSocialContext } from "@/contexts/social.context";
import { useFetch } from "./useFetch";

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
    async function loadPosts(): Promise<"Success" | "Failure"> {
        const http = await httpClient;
        const response = await http.get("/api/posts");
        if (response.status !== "Failure") {
            setPosts(response.payload as Post[]);
        }
        return response.status;
    }

    /**
     * Crée un nouveau post et l'ajoute à la liste locale.
     * @param {string} content - Contenu du post.
     * @param {string[]} images - Liste d'URLs d'images.
     * @returns {Promise<"Success" | "Failure">} Statut de la requête.
     */
    async function createPost(
        content: string,
        images: string[]
    ): Promise<"Success" | "Failure"> {
        const payload: CreatePostPayload = { content, images };
        const http = await httpClient;
        const response = await http.post("/api/post", payload);
        if (response.status !== "Failure") {
            const newPost = response.payload as Post;
            setPosts([newPost, ...posts]);
        }
        return response.status;
    }

    /**
     * Toggle le like sur un post (like/unlike).
     * @param {string} postId - Identifiant du post.
     * @returns {Promise<"Success" | "Failure">} Statut de la requête.
     */
    async function toggleLike(postId: string): Promise<"Success" | "Failure"> {
        const http = await httpClient;
        const response = await http.post(`/api/post/${postId}/like`, {});
        if (response.status !== "Failure") {
            // Recharger les posts pour mettre à jour les likes
            await loadPosts();
        }
        return response.status;
    }

    /**
     * Ajoute un commentaire à un post donné.
     * @param {string} postId - Identifiant du post.
     * @param {string} content - Contenu du commentaire.
     * @returns {Promise<PostComment | null>} Le commentaire ajouté ou `null` si échec.
     */
    async function addComment(
        postId: string,
        content: string
    ): Promise<PostComment | null> {
        const payload: AddPostCommentPayload = { content };
        const http = await httpClient;
        const response = await http.post(`/api/post/${postId}/comment`, payload);
        if (response.status !== "Failure") {
            return response.payload as PostComment;
        }
        return null;
    }

    /**
     * Récupère les commentaires d'un post spécifique.
     * @param {string} postId - Identifiant du post.
     * @returns {Promise<PostComment[]>} Liste de commentaires (vide si échec).
     */
    async function loadComments(postId: string): Promise<PostComment[]> {
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
    }

    /**
     * Supprime un post.
     * @param {string} postId - Identifiant du post à supprimer.
     * @returns {Promise<"Success" | "Failure">} Statut de la requête.
     */
    async function deletePost(postId: string): Promise<"Success" | "Failure"> {
        const http = await httpClient;
        const response = await http.delete(`/api/post/${postId}`);
        if (response.status !== "Failure") {
            setPosts(posts.filter(p => p.id !== postId));
        }
        return response.status;
    }

    /**
     * Récupère les posts créés par l'utilisateur connecté.
     * @returns {Promise<Post[]>} Liste de posts (vide si échec).
     */
    async function getUserPosts(): Promise<Post[]> {
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
    }

    return {
        loadPosts,
        createPost,
        toggleLike,
        addComment,
        loadComments,
        deletePost,
        getUserPosts,
    };
}
