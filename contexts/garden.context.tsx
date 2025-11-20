import { useFetch } from "@/hooks/useFetch";
import { AddVegetableToGardenPayload, GardenVegetable, Vegetable } from "@/models/models";
import { createContext, ReactNode, useContext, useState } from "react";


interface GardenContextType {
    gardenVegetables: GardenVegetable[];
    loadGardenVegetables: () => Promise<"Success" | "Failure">;
    addVegetableToGarden: (vegetable: Vegetable) => Promise<"Success" | "Failure">;
    removeVegetablesFromGarden: (vegetableId: string) => Promise<"Success" | "Failure">
}

const GardenContext = createContext<GardenContextType | undefined>(undefined);

export function GardenProvider({ children }: { children: ReactNode }) {
    const [gardenVegetables, setGardenVegetables] = useState<GardenVegetable[]>([]);
    const { httpClient } = useFetch()

    async function loadGardenVegetables(): Promise<"Success" | "Failure"> {
        const http = await httpClient

        const response = await http.get('/api/user/vegetables');
        if (response.status !== 'Failure') {
            const data = response.payload as GardenVegetable[]
            setGardenVegetables(data)
        }
        return response.status
    }


    async function addVegetableToGarden(vegetable: Vegetable): Promise<"Success" | "Failure"> {
        const payload: AddVegetableToGardenPayload = { vegetableId: vegetable.id };
        const http = await httpClient
        const response = await http.post('/api/user/vegetable', payload);
        loadGardenVegetables()
        return response.status
    }

    async function removeVegetablesFromGarden(vegetableId: string): Promise<"Success" | "Failure"> {
        const http = await httpClient
        const response = await http.delete(`/api/user/vegetable/${vegetableId}`)
        return response.status;
    }


    return (
        <GardenContext.Provider value={{
            gardenVegetables, loadGardenVegetables,
            addVegetableToGarden, removeVegetablesFromGarden
        }}>
            {children}
        </GardenContext.Provider>
    );
}

export function useGardenContext() {
    const context = useContext(GardenContext);
    if (!context) {
        throw new Error('error');
    }
    return context;
}