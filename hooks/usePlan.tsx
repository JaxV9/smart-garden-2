import { useEffect, useState } from "react";
import { useFetch } from "./useFetch";

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
    rowIndex: number
}

export function usePlan() {
    const { httpClient } = useFetch(undefined)

    const [scale, setScale] = useState<number>(1);
    const [spaceEditing, setSpaceEditing] = useState<string | null>(null)
    const [gardenSpaces, setGardenSpaces] = useState<GardenSpace[]>([])
    const [gardenSpacesTemp, setGardenSpacesTemp] = useState<GardenSpace[]>([])
    const [isUpdatingCel, setIsUpdatingCel] = useState<boolean>(false)
    const [celData, setCelData] = useState<CelData>();
    const [hasGarden, setHasGarden] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [shouldSave, setShouldSave] = useState<boolean>(false);

    async function loadGardenspaces(): Promise<void> {
        const http = await httpClient;
        const response = await http.get('/api/gardenspace');
        if (response.status !== 'Failure') {
            const payload = response.payload as GardenSpace[];
            if (payload.length > 0) {
                setHasGarden(true)
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
        console.log(response)
        if (response.status !== 'Failure') {
            loadGardenspaces()
        }
        setIsSaving(false)
    }

    function addNewSpace(): void {
        const test: GardenSpace = {
            spaceName: 'First space',
            area: [{ cols: [{}, {}, {}, {}, {}] },
            { cols: [{}, {}, {}, {}, {}] },
            { cols: [{}, {}, {}, {}, {}] },
            { cols: [{}, {}, {}, {}, {}] },
            { cols: [{}, {}, {}, {}, {}] },
            { cols: [{}, {}, {}, {}, {}] },
            ],
        }
        setGardenSpaces([test])
        setHasGarden(true)
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
        setGardenSpaces(gardenSpaces.map((gardenSpace) =>
            gardenSpace.spaceName === spaceName
                ? { ...gardenSpace, name: newName }
                : gardenSpace
        ))
    }

    function closeIsUpdatingCel(): void {
        setIsUpdatingCel(false)
    }

    function editCel(spaceName: string, rowIndex: number, colIndex: number, close: boolean): void {
        if (close) {
            closeIsUpdatingCel()
            return setCelData(undefined)
        }
        setIsUpdatingCel(true)
        setCelData({ spaceName, colIndex, rowIndex })
    }

    function updateCelWithVege(gardenVegetableId: string): void {
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
        toggleSpaceEditor,
        updateCelWithVege,
        editCel,
        setScale,
        addNewSpace,
        updateSpaceName,
        spaceEditing,
        setGardenSpaces,
        closeIsUpdatingCel,
        saveGardenSpaces
    };
}
