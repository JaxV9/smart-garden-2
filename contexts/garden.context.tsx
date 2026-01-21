import { GardenVegetable } from "@/models/models";
import { createContext, ReactNode, useContext, useState } from "react";

export type GardenInfo = {
  name: string | null;
  location: string | null;
  sections: string[]; 
};

interface GardenContextType {
    gardenVegetables: GardenVegetable[];
    setGardenVegetables: React.Dispatch<React.SetStateAction<GardenVegetable[]>>

    gardenInfo: GardenInfo;
    setGardenInfo: React.Dispatch<React.SetStateAction<GardenInfo>>;
    updateGardenInfo: (patch: Partial<GardenInfo>) => void;
}

const GardenContext = createContext<GardenContextType | undefined>(undefined);

export function GardenProvider({ children }: { children: ReactNode }) {
    const [gardenVegetables, setGardenVegetables] = useState<GardenVegetable[]>([]);
    const [gardenInfo, setGardenInfo] = useState<GardenInfo>({
        name: null,
        location: null,
        sections: ["Potager principal"],
    });

    const updateGardenInfo = (patch: Partial<GardenInfo>) => {
        setGardenInfo((prev) => ({ ...prev, ...patch }));
    };

    return (
        <GardenContext.Provider
        value={{
            gardenVegetables,
            setGardenVegetables,
            gardenInfo,
            setGardenInfo,
            updateGardenInfo,
        }}
        >
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