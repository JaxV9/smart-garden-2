import { GardenVegetable } from "@/models/models";
import { createContext, ReactNode, useContext, useState } from "react";


interface GardenContextType {
    gardenVegetables: GardenVegetable[];
    setGardenVegetables: React.Dispatch<React.SetStateAction<GardenVegetable[]>>
}

const GardenContext = createContext<GardenContextType | undefined>(undefined);

export function GardenProvider({ children }: { children: ReactNode }) {
    const [gardenVegetables, setGardenVegetables] = useState<GardenVegetable[]>([]);
    return (
        <GardenContext.Provider value={{
            gardenVegetables, setGardenVegetables,
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