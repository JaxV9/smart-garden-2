import { Vegetable } from "@/models/models";
import { createContext, ReactNode, useContext, useState } from "react";


interface VegetablesContextType {
    vegetablesContext: Vegetable[];
    loadVegetables: () => Promise<void>;
}

const VegetablesContext = createContext<VegetablesContextType | undefined>(undefined);

export function VegetablesProvider({ children }: { children: ReactNode }) {
    const [vegetablesContext, setVegetablesContext] = useState<Vegetable[]>([]);

    async function loadVegetables(): Promise<void> {
        try {
            const url = 'https://outamtvthkoviplxcznc.supabase.co/storage/v1/object/public/vegetables/trefleapi_plants_30.json';
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json() as Vegetable[];
            console.log('Vegetables loaded:', data);
            setVegetablesContext(data);
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