import { useFetch } from "./useFetch";

export interface UpdateUserPayload {
    name?: string;
    email?: string;
    phone?: string;
    bio?: string;
}

/**
 * Hook personnalisé permettant de manipuler les données utilisateur
 * via des appels HTTP vers l'API. 
 * 
 * Fournit actuellement une méthode pour mettre à jour les informations utilisateur.
 */
export function useUser() {
    const { httpClient } = useFetch(undefined);

    async function updateUser(payload: UpdateUserPayload): Promise<"Success" | "Failure"> {
        try {
            const http = await httpClient;
            const response = await http.put("/api/user", payload);
            
            if (response.status !== "Failure") {
                return "Success";
            }
            return "Failure";
        } catch (error) {
            console.error("Erreur updateUser:", error);
            return "Failure";
        }
    }

    return {
        updateUser,
    };
}
