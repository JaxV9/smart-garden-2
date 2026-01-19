import { Image } from "expo-image"
import { useEffect, useState } from "react"
import { Pressable, StyleSheet, Text, View } from "react-native"
import { GardenSpace, Row } from "./plan"

export interface DataAreaManager {
    gardenSpaces: GardenSpace[],
    setGardenSpaces: React.Dispatch<React.SetStateAction<GardenSpace[]>>,
    spaceEditing: string | null,
    toggleSpaceEditor: (spaceName: string) => void
}


export const AreaManager = ({ gardenSpaces, setGardenSpaces, spaceEditing, toggleSpaceEditor }: DataAreaManager) => {

    const [currentSpace, setCurrentSpace] = useState<GardenSpace>();
    const [currentRows, setCurrentRows] = useState<number>(0);
    const [currentCols, setCurrentCols] = useState<number>(0);

    function addCol(): void {
        if (currentCols === 12) return
        if (!currentSpace) return

        const updatedSpace: GardenSpace = {
            ...currentSpace,
            area: currentSpace.area.map((ar) => ({
                ...ar,
                cols: [...ar.cols, {}]
            }))
        }

        setCurrentSpace(updatedSpace)
    }

    function decreaseCol(): void {
        if (currentCols === 1) return
        if (!currentSpace) return

        const updatedSpace: GardenSpace = {
            ...currentSpace,
            area: currentSpace.area.map((ar) => ({
                ...ar,
                cols: ar.cols.slice(0, -1)
            }))
        }

        setCurrentSpace(updatedSpace)
    }

    function addRow(): void {
        if (currentRows === 12) return
        if (!currentSpace) return

        const newRow: Row = {
            cols: Array(currentCols).fill({})
        }

        const updatedSpace: GardenSpace = {
            ...currentSpace,
            area: [...currentSpace.area, newRow]
        }

        setCurrentSpace(updatedSpace)
    }

    function decreaseRow(): void {
        if (currentRows === 1) return
        if (!currentSpace) return

        const updatedSpace: GardenSpace = {
            ...currentSpace,
            area: currentSpace.area.slice(0, -1)
        }

        setCurrentSpace(updatedSpace)
    }

    useEffect(() => {
        const space = gardenSpaces.find((gardenSpace) => gardenSpace.name === spaceEditing);
        setCurrentSpace(space);
    }, [gardenSpaces, spaceEditing])

    useEffect(() => {
        const rows = currentSpace ? currentSpace.area.length : 0
        setCurrentRows(rows);
        const cols = currentSpace ? currentSpace?.area[0].cols.length : 0
        setCurrentCols(cols);
    }, [currentSpace])

    useEffect(() => {
        if (currentSpace) {
            const space = gardenSpaces.filter((gardenSpace) => gardenSpace.name !== currentSpace?.name)
            if (!currentSpace) return
            setGardenSpaces([...space, currentSpace])
        }
    }, [currentSpace])

    return (
        <>
            <View style={styles.container}>
                <Pressable onPress={() => toggleSpaceEditor(currentSpace ? currentSpace.name : '')}>
                    <Image
                        source={require('@/assets/icons/delete.svg')}
                        style={styles.icon}
                    />
                </Pressable>
                <Text style={styles.title}>Définir la taille du potager</Text>
                <View style={styles.header}>
                    <View style={styles.headerElement}>
                        <View style={styles.areaManager}>
                            <Pressable onPress={() => decreaseRow()} style={styles.setterBtn}>
                                <Text style={styles.btnLabel}>-</Text>
                            </Pressable>
                            <Text style={styles.label}>{currentRows} Lignes</Text>
                            <Pressable onPress={() => addRow()} style={styles.setterBtn}>
                                <Text style={styles.btnLabel}>+</Text>
                            </Pressable>
                        </View>
                    </View>
                    <View style={styles.headerElement}>
                        <View style={styles.areaManager}>
                            <Pressable onPress={() => decreaseCol()} style={styles.setterBtn}>
                                <Text style={styles.btnLabel}>-</Text>
                            </Pressable>
                            <Text style={styles.label}>{currentCols} colonnes</Text>
                            <Pressable onPress={() => addCol()} style={styles.setterBtn}>
                                <Text style={styles.btnLabel}>+</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        gap: 16,
        zIndex: 9999,
        elevation: 9999,
        borderColor: '#9c9a9774',
        backgroundColor: '#F9FAFB',
        borderBottomWidth: 1,
        paddingTop: 28,
        paddingBottom: 16
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        gap: 16,
        textAlign: 'center'
    },
    icon: {
        width: 32,
        height: 32,
        marginLeft: 'auto',
        marginRight: 8,
        marginTop: -28
    },
    title: {
        margin: 'auto',
        fontSize: 18,
        fontWeight: 600
    },
    label: {
        fontSize: 16
    },
    headerElement: {
        alignItems: 'center',
        gap: 8
    },
    setterBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#dfe2e6ff',
        width: 32,
        height: 32,
        borderRadius: '50%'
    },
    btnLabel: {
        fontSize: 20,
        marginTop: -2
    },
    areaManager: {
        flexDirection: 'row',
        gap: 16,
        alignItems: 'center',
        justifyContent: 'center'
    },
});