import { useTutorialsContext } from "@/contexts/tutorials.context";
import { useFetch } from "./useFetch";
import { useCallback } from "react";


/**
 * Type de tutoriel (VIDEO ou ARTICLE).
 */
export type TutorialType = 'VIDEO' | 'ARTICLE';


/**
 * Catégorie de tutoriel.
 */
export type TutorialCategory = 'ASTUCES' | 'DIY' | 'TECHNIQUES';


/**
 * Représente un tutoriel.
 */
export interface Tutorial {
    id: string;
    title: string;
    description?: string;
    type: TutorialType;
    category: TutorialCategory;
    videoUrl?: string;
    videoDuration?: number;
    thumbnail?: string;
    content?: string;
    images: string[];
    authorId: string;
    author: {
        id: string;
        name?: string;
    };
    viewCount: number;
    createdAt: string;
    _count: {
        likes: number;
    };
    isLikedByUser?: boolean;
}


/**
 * Données envoyées lors de la création d'un tutoriel.
 */
export interface CreateTutorialPayload {
    title: string;
    description?: string;
    type: TutorialType;
    category: TutorialCategory;
    videoUrl?: string;
    videoDuration?: number;
    thumbnail?: string;
    content?: string;
    images?: string[];
}


/**
 * Hook personnalisé pour interagir avec les tutoriels.
 * Fournit des fonctions de chargement, création et interaction
 * avec les tutoriels (vidéos et articles).
 */
export function useTutorials() {
    const { tutorials, setTutorials } = useTutorialsContext();
    const { httpClient } = useFetch(undefined);


    /**
     * Charge la liste des tutoriels, avec filtres optionnels.
     * @param {TutorialCategory} [category] - Catégorie pour filtrer.
     * @param {TutorialType} [type] - Type pour filtrer (VIDEO ou ARTICLE).
     * @returns {Promise<"Success" | "Failure">} Statut de la requête.
     */
    const loadTutorials = useCallback(async (
        category?: TutorialCategory,
        type?: TutorialType
    ): Promise<"Success" | "Failure"> => {
        const http = await httpClient;
        
        const params = new URLSearchParams();
        if (category) params.append('category', category);
        if (type) params.append('type', type);
        
        const url = params.toString() 
            ? `/api/tutorials?${params.toString()}` 
            : "/api/tutorials";
        
        const response = await http.get(url);
        if (response.status !== "Failure") {
            setTutorials(response.payload as Tutorial[]);
        }
        return response.status;
    }, [httpClient, setTutorials]);


    /**
     * Récupère les détails d'un tutoriel spécifique par son ID.
     * @param {string} tutorialId - Identifiant du tutoriel à récupérer.
     * @returns {Promise<Tutorial | null>} Le tutoriel complet ou `null` en cas d'échec.
     */
    const loadTutorialById = useCallback(async (tutorialId: string): Promise<Tutorial | null> => {
        const http = await httpClient;
        const response = await http.get(`/api/tutorial/${tutorialId}`);
        if (response.status !== "Failure") {
            return response.payload as Tutorial;
        }
        return null;
    }, [httpClient]);


    /**
     * Crée un nouveau tutoriel et l'ajoute à la liste locale.
     * @param {CreateTutorialPayload} tutorialData - Données du tutoriel.
     * @returns {Promise<"Success" | "Failure">} Statut de la requête.
     */
    const createTutorial = useCallback(async (
        tutorialData: CreateTutorialPayload
    ): Promise<"Success" | "Failure"> => {
        const http = await httpClient;
        const response = await http.post("/api/tutorial", tutorialData);
        if (response.status !== "Failure") {
            const newTutorial = response.payload as Tutorial;
            setTutorials([newTutorial, ...tutorials]);
        }
        return response.status;
    }, [httpClient, tutorials, setTutorials]);


    /**
     * Toggle le like sur un tutoriel (like/unlike).
     * Met à jour immédiatement l'interface localement.
     * @param {string} tutorialId - Identifiant du tutoriel.
     * @returns {Promise<"Success" | "Failure">} Statut de la requête.
     */
    const toggleLike = useCallback(async (tutorialId: string): Promise<"Success" | "Failure"> => {
        try {
            // Mise à jour optimiste locale avant l'appel API (functional state)
            setTutorials((prevTutorials) => prevTutorials.map((tutorial: Tutorial) => {
                if (tutorial.id === tutorialId) {
                    const isCurrentlyLiked = tutorial.isLikedByUser || false;
                    return {
                        ...tutorial,
                        isLikedByUser: !isCurrentlyLiked,
                        _count: {
                            ...tutorial._count,
                            likes: isCurrentlyLiked 
                                ? tutorial._count.likes - 1 
                                : tutorial._count.likes + 1
                        }
                    };
                }
                return tutorial;
            }));

            // Appel API
            const http = await httpClient;
            const response = await http.post(`/api/tutorial/${tutorialId}/like`, {});
            
            if (response.status === "Failure") {
                // Rollback en cas d'échec (relance inversée)
                setTutorials((prev) => prev.map((t: Tutorial) => t.id === tutorialId ? {
                    ...t,
                    isLikedByUser: !t.isLikedByUser,
                    _count: { ...t._count, likes: t.isLikedByUser ? t._count.likes - 1 : t._count.likes + 1 }
                } : t));
                return "Failure";
            }
            
            return "Success";
        } catch (error) {
            console.error('Erreur toggleLike:', error);
            // Rollback basique si API crash complètement
            setTutorials((prev) => prev.map((t: Tutorial) => t.id === tutorialId ? {
                ...t,
                isLikedByUser: !t.isLikedByUser,
                _count: { ...t._count, likes: t.isLikedByUser ? t._count.likes - 1 : t._count.likes + 1 }
            } : t));
            return "Failure";
        }
    }, [httpClient, setTutorials]);


    /**
     * Incrémente le compteur de vues d'un tutoriel.
     * Met à jour localement le tutoriel dans la liste après l'incrémentation.
     * @param {string} tutorialId - Identifiant du tutoriel.
     * @returns {Promise<"Success" | "Failure">} Statut de la requête.
     */
    const incrementViewCount = useCallback(async (tutorialId: string): Promise<"Success" | "Failure"> => {
        try {
            // Mise à jour locale immédiate
            const updatedTutorials = tutorials.map((tutorial: Tutorial) => 
                tutorial.id === tutorialId 
                    ? { ...tutorial, viewCount: tutorial.viewCount + 1 }
                    : tutorial
            );
            setTutorials(updatedTutorials);

            // Appel API en arrière-plan
            const http = await httpClient;
            await http.post(`/api/tutorial/${tutorialId}/view`, {});
            
            return "Success";
        } catch (error) {
            // Erreur non critique, on garde la mise à jour locale
            console.log('Erreur incrémentation vues (non critique):', error);
            return "Success";
        }
    }, [httpClient, tutorials, setTutorials]);


    /**
     * Supprime un tutoriel.
     * @param {string} tutorialId - Identifiant du tutoriel à supprimer.
     * @returns {Promise<"Success" | "Failure">} Statut de la requête.
     */
    const deleteTutorial = useCallback(async (tutorialId: string): Promise<"Success" | "Failure"> => {
        const http = await httpClient;
        const response = await http.delete(`/api/tutorial/${tutorialId}`);
        if (response.status !== "Failure") {
            const filteredTutorials = tutorials.filter((t: Tutorial) => t.id !== tutorialId);
            setTutorials(filteredTutorials);
        }
        return response.status;
    }, [httpClient, tutorials, setTutorials]);


    /**
     * Récupère les tutoriels créés par l'utilisateur connecté.
     * @returns {Promise<Tutorial[]>} Liste de tutoriels (vide si échec).
     */
    const getUserTutorials = useCallback(async (): Promise<Tutorial[]> => {
        try {
            const http = await httpClient;
            const response = await http.get("/api/user/tutorials");

            if (response.status !== "Failure") {
                return response.payload as Tutorial[];
            }
            return [];
        } catch (error) {
            console.error("Erreur getUserTutorials:", error);
            return [];
        }
    }, [httpClient]);


    /**
     * Récupère la liste des catégories disponibles.
     * @returns {Promise<TutorialCategory[]>} Liste des catégories (vide si échec).
     */
    const getCategories = useCallback(async (): Promise<TutorialCategory[]> => {
        try {
            const http = await httpClient;
            const response = await http.get("/api/categories");

            if (response.status !== "Failure") {
                return response.payload as TutorialCategory[];
            }
            return [];
        } catch (error) {
            console.error("Erreur getCategories:", error);
            return [];
        }
    }, [httpClient]);


    return {
        loadTutorials,
        loadTutorialById,
        createTutorial,
        toggleLike,
        incrementViewCount,
        deleteTutorial,
        getUserTutorials,
        getCategories,
    };
}
