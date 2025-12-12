import { useCallback, useMemo, useState } from "react";
import { useVegetablesContext } from "@/contexts/vegetables.context";
import { fetchVegetables } from "@/utils/vegetableData";

export function useVegetable() {
  const { vegetablesContext, setVegetablesContext } = useVegetablesContext();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadVegetables = useCallback(async (): Promise<void> => {

    if (Array.isArray(vegetablesContext) && vegetablesContext.length > 0) return;

    setIsLoading(true);
    setError(null);

    try {
      const vegetables = await fetchVegetables();
      setVegetablesContext(vegetables);
    } catch (e: any) {
      console.error("Failed to load vegetables:", e);
      setError(e?.message ? String(e.message) : "Failed to load vegetables");
    } finally {
      setIsLoading(false);
    }
  }, [vegetablesContext, setVegetablesContext]);

  return useMemo(
    () => ({
      loadVegetables,
      isLoading,
      error,
    }),
    [loadVegetables, isLoading, error]
  );
}