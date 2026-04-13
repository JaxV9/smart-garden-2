import { useVegetablesContext } from "@/contexts/vegetables.context"
import { GardenSpace } from "@/hooks/usePlan"
import { Image } from "expo-image"
import { useEffect, useMemo, useRef, useState } from "react"
import { Pressable, StyleSheet, TextInput, View } from "react-native"

interface SpaceProps {
    scale: number,
    gardenSpace: GardenSpace,
    isUpdatingCel: boolean,
    toggleSpaceEditor: (spaceName: string) => void,
    updateSpaceName: (spaceName: string, newName: string) => void,
    editCel: (spaceName: string, rowIndex: number, colIndex: number, close: boolean, vegeId?: string) => void
}

export const Space = ({ scale, gardenSpace, isUpdatingCel, toggleSpaceEditor, updateSpaceName, editCel }: SpaceProps) => {
    const [isEditingName, setIsEditingName] = useState<boolean>(false);
    const inputRef = useRef<TextInput>(null);
    const [updatingCol, setUpdatingCol] = useState<{ col: number, row: number }>()
    const [spaceSize, setSpaceSize] = useState<{ width: number, height: number }>({ width: 0, height: 0 });

    useEffect(() => {
        if (!isUpdatingCel) {
            setUpdatingCol(undefined)
        }
    }, [isUpdatingCel])

    const { vegetablesContext } = useVegetablesContext();

    function getIconUrl(vegetableId: string): string {
        if (!vegetableId) return ''

        const vegetable = vegetablesContext.find((vegetable) => vegetable.id === vegetableId);
        if (!vegetable) return ''
        return vegetable.icons
    }

    function changeName(newName: string): void {
        setIsEditingName(true)
        const currentName = gardenSpace.spaceName;
        updateSpaceName(currentName, newName);
    }

    function validChange(): void {
        setIsEditingName(false)
        inputRef.current?.blur()
    }

    function updateCel(rowId: number, colId: number, vegeId?: string): void {
        editCel(gardenSpace.spaceName, rowId, colId, celIsFocus(colId, rowId), vegeId);
        if (updatingCol && updatingCol.col === colId && updatingCol.row === rowId) {
            return setUpdatingCol(undefined)
        }
        setUpdatingCol({ col: colId, row: rowId })
    }

    function celIsFocus(col: number, row: number): boolean {
        if (!updatingCol) return false
        return updatingCol.col === col && updatingCol.row === row
    }

    function getStyle(rowId: number, colId: number, col: { vegetableId?: string | undefined }) {
        if (celIsFocus(colId, rowId)) {
            return styles.focusOnCel
        }
        if (col.vegetableId) {
            return styles.colSelected
        }
        return styles.col
    }

    const centeredPosition = useMemo(() => ({
        top: 25000 - (spaceSize.height / 2) + 150,
        left: 25000 - (spaceSize.width / 2)
    }), [spaceSize.width, spaceSize.height]);

    return (
        <View
            style={[styles.spaceContainer, { top: centeredPosition.top, left: centeredPosition.left }]}
            onLayout={(event) => {
                const { width, height } = event.nativeEvent.layout;
                if (width !== spaceSize.width || height !== spaceSize.height) {
                    setSpaceSize({ width, height });
                }
            }}
        >
            <View pointerEvents="box-none">
                <View style={styles.spaceEditContainer} pointerEvents="box-none">
                    <TextInput
                        ref={inputRef}
                        value={gardenSpace.spaceName}
                        onChangeText={(newName) => changeName(newName)}
                        pointerEvents="auto"
                    />
                    {
                        isEditingName ?
                            <Pressable onPress={() => validChange()} pointerEvents="auto">
                                <Image source={require('@/assets/icons/valid.svg')}
                                    style={{ width: 28, height: 28 }} />
                            </Pressable>
                            :
                            <Pressable onPress={() => toggleSpaceEditor(gardenSpace.spaceName)} pointerEvents="auto">
                                <Image source={require('@/assets/icons/menu.svg')}
                                    style={{ width: 28, height: 28 }} />
                            </Pressable>
                    }

                </View>

                <View style={styles.gridContainer}>
                    {
                        gardenSpace.area.map((ar, rowId) => (
                            <View key={rowId} style={styles.row}>
                                {ar.cols.map((col, colId) => (
                                    <Pressable onPress={() => updateCel(rowId, colId, col?.vegetableId)} key={colId}
                                        style={getStyle(rowId, colId, col)}>
                                        {
                                            col.vegetableId ?
                                                <Image source={getIconUrl(col.vegetableId)}
                                                    style={styles.vegeIcon} />
                                                :
                                                <View style={styles.dot}></View>

                                        }
                                    </Pressable>
                                ))}
                            </View>
                        ))
                    }
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    spaceContainer: {
        position: 'absolute',
    },
    gridContainer: {
        gap: 8,
    },
    row: {
        flexDirection: "row",
        gap: 8,
        alignSelf: 'flex-start',
    },
    col: {
        width: 64,
        height: 64,
        backgroundColor: '#F4EFE8',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#9c9a9774',
    },
    dot: {
        width: 3,
        height: 3,
        backgroundColor: '#9c9a9774',
        borderRadius: '50%',
        margin: 'auto'
    },
    spaceEditContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8
    },
    colSelected: {
        width: 64,
        height: 64,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#9c9a9774',
        backgroundColor: '#DCFCE7'
    },
    focusOnCel: {
        width: 64,
        height: 64,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#21ce5eff',
        backgroundColor: '#F4EFE8',
        transform: [{ scale: 1.3 }],
        zIndex: 2
    },
    vegeIcon: {
        width: 42,
        height: 42,
        margin: 'auto'
    },
});