
import { useGardenContext } from '@/contexts/garden.context';
import { GardenVegetable } from '@/models/models';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AreaManager } from './areaManager';
import { GardenVegeList } from './gardenVegeList';
import { Space } from './space';
import { Touch } from './touch';
import { ZoomItem } from './zoom';

export interface Row {
    cols: {
        vegetable?: GardenVegetable
    }[]
}

export interface GardenSpace {
    name: string,
    area: Row[],
}

export interface CelData {
    spaceName: string,
    colIndex: number,
    rowIndex: number
}

export const Plan = () => {
    const { gardenVegetables } = useGardenContext()

    const [scale, setScale] = useState<number>(1);
    const [spaceEditing, setSpaceEditing] = useState<string | null>(null)
    const [gardenSpaces, setGardenSpaces] = useState<GardenSpace[]>([])
    const [isUpdatingCel, setIsUpdatingCel] = useState<boolean>(false)
    const [celData, setCelData] = useState<CelData>();


    function addNewSpace(): void {
        const test: GardenSpace = {
            name: 'First space',
            area: [{ cols: [{}, {}, {}, {}, {}] },
            { cols: [{}, {}, {}, {}, {}] },
            { cols: [{}, {}, {}, {}, {}] },
            { cols: [{}, {}, {}, {}, {}] },
            { cols: [{}, {}, {}, {}, {}] },
            { cols: [{}, {}, {}, {}, {}] },
            ],
        }
        setGardenSpaces([test])
    }

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
            gardenSpace.name === spaceName
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

    function updateCelWithVege(gardenVegetable: GardenVegetable): void {
        if (!celData) return

        setGardenSpaces(prevSpaces =>
            prevSpaces.map(gardenSpace => {
                if (gardenSpace.name !== celData.spaceName) {
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
                                    vegetable: gardenVegetable
                                }
                            })
                        }
                    })
                }
            })
        )

    }

    return (
        <View style={styles.container}>
            <Touch scale={scale} isAbsolute={true}>
                {
                    gardenSpaces.map((gardenSpace, index) => (
                        <Space key={index} gardenSpace={gardenSpace} scale={scale} editCel={editCel}
                            toggleSpaceEditor={toggleSpaceEditor} updateSpaceName={updateSpaceName} />
                    ))
                }
            </Touch>
            {
                gardenSpaces.length === 0 ?
                    <View style={styles.newSpaceNotif}>
                        <Text style={styles.newSpaceNotifLabel}>Vous n'avez pas encore d'espace de jardinage</Text>
                        <Pressable style={styles.button} onPress={() => addNewSpace()}>
                            <Text style={styles.btnTxt}>Ajouter un nouvel espace</Text>
                        </Pressable>
                    </View>
                    :
                    <>
                        {
                            spaceEditing !== null &&
                            <AreaManager gardenSpaces={gardenSpaces} setGardenSpaces={setGardenSpaces}
                                spaceEditing={spaceEditing} toggleSpaceEditor={toggleSpaceEditor} />
                        }
                        {
                            isUpdatingCel ?
                                <GardenVegeList gardenVegetables={gardenVegetables}
                                    closeIsUpdatingCel={closeIsUpdatingCel} updateCelWithVege={updateCelWithVege} />
                                :
                                <ZoomItem scale={scale} setScale={setScale} />
                        }
                    </>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: 28,
        position: 'absolute',
        top: 64,
        left: 0,
        right: 0,
        bottom: 0
    },
    newSpaceNotif: {
        position: 'absolute',
        width: '70%',
        gap: 16,
        top: '50%',
        left: '50%',
        transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
        zIndex: 1000,
    },
    newSpaceNotifLabel: {
        textAlign: 'center',
        fontSize: 16
    },
    button: {
        height: 48,
        borderRadius: 10,
        backgroundColor: "#16A34A",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
    },
    btnTxt: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
    },
});