import { useEffect, useState } from "react";
import { useFetch } from "./useFetch";
import { useUserContext } from "@/contexts/user.context";
import { useRouter } from "expo-router";
import { useGardenContext } from "@/contexts/garden.context";

export interface Row {
    cols: {
        vegetableId?: string
    }[]
}

export interface GardenSpace {
    id?: string
    spaceName: string,
    area: Row[],
}

export interface CelData {
    spaceName: string,
    colIndex: number,
    rowIndex: number,
    vegeId?: string
}

export function usePlan() {
    const { httpClient } = useFetch(undefined)
    const { isPremium } = useUserContext();
    const { gardenInfo } = useGardenContext();
    const router = useRouter();

    const defaultPlanName = gardenInfo.name || "Mon Potager";

    const [scale, setScale] = useState<number>(1);
    const [spaceEditing, setSpaceEditing] = useState<string | null>(null)
    const [gardenSpaces, setGardenSpaces] = useState<GardenSpace[]>([])
    const [gardenSpacesTemp, setGardenSpacesTemp] = useState<GardenSpace[]>([])
    const [isUpdatingCel, setIsUpdatingCel] = useState<boolean>(false)
    const [celData, setCelData] = useState<CelData>();
    const [hasGarden, setHasGarden] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [shouldSave, setShouldSave] = useState<boolean>(false);

    const [activePlan, setActivePlan] = useState<string>(defaultPlanName);

    useEffect(() => {
        if (activePlan === "Mon Potager" && gardenInfo.name) {
            setActivePlan(gardenInfo.name);
        }
    }, [gardenInfo.name]);

    const computedPlans = Array.from(new Set(gardenSpaces.map(s => {
        const parts = s.spaceName.split(' | ');
        return parts.length > 1 ? parts[0] : defaultPlanName;
    })));
    const allPlans = computedPlans.length > 0 ? computedPlans : [defaultPlanName];

    const activeSpaces = gardenSpaces.filter(s => {
        const parts = s.spaceName.split(' | ');
        const planName = parts.length > 1 ? parts[0] : defaultPlanName;
        return planName === activePlan;
    });

    async function loadGardenspaces(): Promise<void> {
        const http = await httpClient;
        const response = await http.get('/api/gardenspace');
        if (response.status !== 'Failure') {
            const payload = response.payload as GardenSpace[];
            if (payload.length > 0) {
                setHasGarden(true)
                const parsedPlans = Array.from(new Set(payload.map(s => {
                    const parts = s.spaceName.split(' | ');
                    return parts.length > 1 ? parts[0] : defaultPlanName;
                })));
                if (parsedPlans.length > 0) {
                    setActivePlan(prev => {
                        if (parsedPlans.includes(prev)) return prev;
                        return parsedPlans[0];
                    });
                }
            }
            setGardenSpaces(payload)
            setGardenSpacesTemp(payload)
        }
    }

    useEffect(() => {
        if (gardenSpaces !== gardenSpacesTemp) {
            setShouldSave(true);
        } else {
            setShouldSave(false);
        }
    }, [gardenSpaces, gardenSpacesTemp])

    async function saveGardenSpaces(): Promise<void> {
        setIsSaving(true)
        const http = await httpClient
        const payload = {
            gardenSpaces: gardenSpaces
        };
        const response = await http.post('/api/gardenspace', payload);

        if (response.status !== 'Failure') {
            loadGardenspaces()
        }
        setIsSaving(false)
    }

    function addNewSpace(): void {
        const baseName = `Espace ${activeSpaces.length + 1}`;
        const fullName = `${activePlan} | ${baseName}`;
        const newSpace: GardenSpace = {
            spaceName: fullName,
            area: [{ cols: [{}, {}, {}, {}, {}] },
            { cols: [{}, {}, {}, {}, {}] },
            { cols: [{}, {}, {}, {}, {}] },
            { cols: [{}, {}, {}, {}, {}] },
            { cols: [{}, {}, {}, {}, {}] },
            { cols: [{}, {}, {}, {}, {}] },
            ],
        }
        setGardenSpaces([...gardenSpaces, newSpace])
        setHasGarden(true)
    }

    function addNewPlan(newPlanName: string): void {
        if (!isPremium && allPlans.length >= 1) {
            router.push('/premium' as any);
            return;
        }
        const fullName = `${newPlanName} | Zone 1`;
        const newSpace: GardenSpace = {
            spaceName: fullName,
            area: [{ cols: [{}, {}, {}, {}, {}] },
            { cols: [{}, {}, {}, {}, {}] },
            { cols: [{}, {}, {}, {}, {}] },
            { cols: [{}, {}, {}, {}, {}] },
            { cols: [{}, {}, {}, {}, {}] },
            { cols: [{}, {}, {}, {}, {}] },
            ],
        }
        setGardenSpaces([...gardenSpaces, newSpace])
        setHasGarden(true)
        setActivePlan(newPlanName)
    }

    function deletePlan(planToDelete: string): void {
        const updated = gardenSpaces.filter(s => {
            const parts = s.spaceName.split(' | ');
            const planName = parts.length > 1 ? parts[0] : defaultPlanName;
            return planName !== planToDelete;
        });
        setGardenSpaces(updated);
        const remainingPlans = allPlans.filter(p => p !== planToDelete);
        setActivePlan(remainingPlans[0] || defaultPlanName);
    }

    useEffect(() => {
        loadGardenspaces()
    }, [])

    function toggleSpaceEditor(spaceName: string): void {
        setIsUpdatingCel(false)
        if (spaceEditing !== null) {
            return setSpaceEditing(null)
        }
        setSpaceEditing(spaceName)
    }

    function updateSpaceName(spaceName: string, newName: string): void {
        if (spaceEditing !== null) {
            return setSpaceEditing(null)
        }
        const parts = spaceName.split(' | ');
        const planPrefix = parts.length > 1 ? parts[0] : activePlan;
        const newSpaceFullName = `${planPrefix} | ${newName}`;

        setGardenSpaces(gardenSpaces.map((gardenSpace) =>
            gardenSpace.spaceName === spaceName
                ? { ...gardenSpace, spaceName: newSpaceFullName }
                : gardenSpace
        ))
    }

    function closeIsUpdatingCel(): void {
        setIsUpdatingCel(false)
    }

    function editCel(spaceName: string, rowIndex: number, colIndex: number, close: boolean, vegeId?: string): void {
        if (close) {
            closeIsUpdatingCel()
            return setCelData(undefined)
        }
        setIsUpdatingCel(true)
        setCelData({ spaceName, colIndex, rowIndex, vegeId })
    }

    function updateCelWithVege(gardenVegetableId: string | undefined): void {
        if (!celData) return

        setGardenSpaces(prevSpaces =>
            prevSpaces.map(gardenSpace => {
                if (gardenSpace.spaceName !== celData.spaceName) {
                    return gardenSpace
                }

                return {
                    ...gardenSpace,
                    area: gardenSpace.area.map((row, rowIndex) => {
                        if (rowIndex !== celData.rowIndex) {
                            return row
                        }

                        return {
                            ...row,
                            cols: row.cols.map((col, colIndex) => {
                                if (colIndex !== celData.colIndex) {
                                    return col
                                }

                                if (gardenVegetableId === undefined) {
                                    const { vegetableId: _, ...cleanCol } = col
                                    return cleanCol
                                }

                                return {
                                    ...col,
                                    vegetableId: gardenVegetableId
                                }
                            })
                        }
                    })
                }
            })
        )
    }

    return {
        scale,
        gardenSpaces,
        isUpdatingCel,
        hasGarden,
        isSaving,
        shouldSave,
        celData,
        toggleSpaceEditor,
        updateCelWithVege,
        editCel,
        setScale,
        addNewSpace,
        updateSpaceName,
        spaceEditing,
        setGardenSpaces,
        closeIsUpdatingCel,
        saveGardenSpaces,
        activePlan,
        setActivePlan,
        allPlans,
        activeSpaces,
        addNewPlan,
        deletePlan
    };
}
