import { useFetch } from "@/hooks/useFetch";
import { Vegetable } from "@/models/models";
import { createContext, ReactNode, useContext, useState } from "react";


interface VegetablesContextType {
    vegetablesContext: Vegetable[];
    loadVegetables: () => Promise<void>;
}

const VegetablesContext = createContext<VegetablesContextType | undefined>(undefined);

export function VegetablesProvider({ children }: { children: ReactNode }) {
    const [vegetablesContext, setVegetablesContext] = useState<Vegetable[]>([]);
    const { httpClient } = useFetch()

    async function loadVegetables(): Promise<void> {
        try {
            const http = await httpClient

            const response = await http.get('/api/vegetables');
            if (response.status !== 'Failure') {
                const data = response.payload as Vegetable[]
                setVegetablesContext(data)
            }
        } catch (error) {
            console.error("Failed to load vegetables:", error);
        }
    }


    return (
        <VegetablesContext.Provider value={{
            vegetablesContext,
            loadVegetables
        }}>
            {children}
        </VegetablesContext.Provider>
    );
}

export function useVegetablesContext() {
    const context = useContext(VegetablesContext);
    if (!context) {
        throw new Error('error');
    }
    return context;
}