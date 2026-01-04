import { Vegetable } from "@/models/models";
import { createContext, ReactNode, useContext, useState } from "react";


interface VegetablesContextType {
    vegetablesContext: Vegetable[];
    setVegetablesContext: React.Dispatch<React.SetStateAction<Vegetable[]>>
}

const VegetablesContext = createContext<VegetablesContextType | undefined>(undefined);

export function VegetablesProvider({ children }: { children: ReactNode }) {
    const [vegetablesContext, setVegetablesContext] = useState<Vegetable[]>([]);

    return (
        <VegetablesContext.Provider value={{
            vegetablesContext, setVegetablesContext
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