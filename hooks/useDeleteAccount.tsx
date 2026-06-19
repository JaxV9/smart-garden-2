import { useFetch } from "./useFetch";
import { useUser } from "./useUser";
import { useCallback, useState } from "react";

export type DeletionScope = {
  garden: boolean;       // Légumes du jardin + plan
  tasks: boolean;        // Toutes les tâches
  sensors: boolean;      // Capteurs & données IoT
  community: boolean;    // Posts & topics du forum
  tutorials: boolean;    // Tutoriels créés
  account: boolean;      // Compte complet (implique tout)
};

export function useDeleteAccount() {
  const { httpClient } = useFetch(undefined);
  const { logout } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Supprime uniquement les données sélectionnées sans fermer le compte */
  const deleteSelectedData = useCallback(async (scope: Omit<DeletionScope, "account">): Promise<"Success" | "Failure"> => {
    setLoading(true);
    setError(null);
    try {
      const http = await httpClient;
      const results = await Promise.all([
        scope.garden    ? http.delete("/api/user/garden/all")     : Promise.resolve({ status: "Success" as const }),
        scope.tasks     ? http.delete("/api/user/tasks/all")      : Promise.resolve({ status: "Success" as const }),
        scope.sensors   ? http.delete("/api/user/sensors/all")    : Promise.resolve({ status: "Success" as const }),
        scope.community ? http.delete("/api/user/community/all")  : Promise.resolve({ status: "Success" as const }),
        scope.tutorials ? http.delete("/api/user/tutorials/all")  : Promise.resolve({ status: "Success" as const }),
      ]);
      const anyFailure = results.some((r: any) => r.status === "Failure");
      return anyFailure ? "Failure" : "Success";
    } catch (e) {
      console.error("deleteSelectedData failed:", e);
      setError("Erreur lors de la suppression des données.");
      return "Failure";
    } finally {
      setLoading(false);
    }
  }, [httpClient]);

  /** Supprime complètement le compte et toutes ses données */
  const deleteAccount = useCallback(async (): Promise<"Success" | "Failure"> => {
    setLoading(true);
    setError(null);
    try {
      const http = await httpClient;
      const response = await http.delete("/api/user");
      if (response.status !== "Failure") {
        await logout();
        return "Success";
      }
      setError("La suppression du compte a échoué.");
      return "Failure";
    } catch (e) {
      console.error("deleteAccount failed:", e);
      setError("Erreur lors de la suppression du compte.");
      return "Failure";
    } finally {
      setLoading(false);
    }
  }, [httpClient, logout]);

  return { deleteSelectedData, deleteAccount, loading, error };
}
