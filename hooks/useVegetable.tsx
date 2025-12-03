import { useVegetablesContext } from "@/contexts/vegetables.context";
import { Vegetable } from "@/models/models";


export function useVegetable() {
    const { setVegetablesContext } = useVegetablesContext()


    async function loadVegetables(): Promise<void> {
        try {
            const url = 'https://outamtvthkoviplxcznc.supabase.co/storage/v1/object/public/vegetables/trefleapi_plants_30.json';
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json() as Vegetable[];
            setVegetablesContext(data);
        } catch (error) {
            console.error("Failed to load vegetables:", error);
        }
    }

    return {
        loadVegetables
    };
}
