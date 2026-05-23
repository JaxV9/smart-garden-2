import { useVegetablesContext } from "@/contexts/vegetables.context"
import { GardenSpace } from "@/hooks/usePlan"
import { Image } from "expo-image"
import { useEffect, useMemo, useRef, useState } from "react"
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native"

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

    const relations = useMemo(() => {
        interface RelationIndicator {
            row: number;
            col: number;
            type: 'horizontal' | 'vertical';
            relation: 'affinity' | 'bad_neighbor';
        }

        const list: RelationIndicator[] = [];
        const numRows = gardenSpace.area.length;
        if (numRows === 0) return list;

        for (let r = 0; r < numRows; r++) {
            const numCols = gardenSpace.area[r].cols.length;
            for (let c = 0; c < numCols; c++) {
                const cell = gardenSpace.area[r].cols[c];
                if (!cell.vegetableId) continue;

                const vegA = vegetablesContext.find(v => v.id === cell.vegetableId);
                if (!vegA) continue;

                if (c + 1 < numCols) {
                    const rightCell = gardenSpace.area[r].cols[c + 1];
                    if (rightCell.vegetableId) {
                        const vegB = vegetablesContext.find(v => v.id === rightCell.vegetableId);
                        if (vegB) {
                            const isAffinity =
                                vegA.affinity?.map(x => x.toLowerCase()).includes(vegB.name.toLowerCase()) ||
                                vegB.affinity?.map(x => x.toLowerCase()).includes(vegA.name.toLowerCase());

                            const isBad =
                                vegA.bad_neighbors?.map(x => x.toLowerCase()).includes(vegB.name.toLowerCase()) ||
                                vegB.bad_neighbors?.map(x => x.toLowerCase()).includes(vegA.name.toLowerCase());

                            if (isAffinity) {
                                list.push({ row: r, col: c, type: 'horizontal', relation: 'affinity' });
                            } else if (isBad) {
                                list.push({ row: r, col: c, type: 'horizontal', relation: 'bad_neighbor' });
                            }
                        }
                    }
                }

                if (r + 1 < numRows) {
                    const bottomCell = gardenSpace.area[r + 1].cols[c];
                    if (bottomCell.vegetableId) {
                        const vegB = vegetablesContext.find(v => v.id === bottomCell.vegetableId);
                        if (vegB) {
                            const isAffinity =
                                vegA.affinity?.map(x => x.toLowerCase()).includes(vegB.name.toLowerCase()) ||
                                vegB.affinity?.map(x => x.toLowerCase()).includes(vegA.name.toLowerCase());

                            const isBad =
                                vegA.bad_neighbors?.map(x => x.toLowerCase()).includes(vegB.name.toLowerCase()) ||
                                vegB.bad_neighbors?.map(x => x.toLowerCase()).includes(vegA.name.toLowerCase());

                            if (isAffinity) {
                                list.push({ row: r, col: c, type: 'vertical', relation: 'affinity' });
                            } else if (isBad) {
                                list.push({ row: r, col: c, type: 'vertical', relation: 'bad_neighbor' });
                            }
                        }
                    }
                }
            }
        }
        return list;
    }, [gardenSpace.area, vegetablesContext]);

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

    function getCellBackgroundColor(vegetableId: string): string {
        const vegetable = vegetablesContext.find((v) => v.id === vegetableId);
        if (!vegetable) return '#F4EFE8';

        const name = vegetable.name.toLowerCase();

        if (name.includes('laitue') || name.includes('epinard') || name.includes('épinard') || name.includes('chou') || name.includes('brocoli') || name.includes('persil') || name.includes('basilic') || name.includes('aromate') || name.includes('menthe')) {
            return '#DCFCE7';
        }
        if (name.includes('tomate') || name.includes('poivron') || name.includes('aubergine') || name.includes('fraise')) {
            return '#FFE4E6';
        }
        if (name.includes('carotte') || name.includes('radis') || name.includes('betterave') || name.includes('poireau') || name.includes('oignon') || name.includes('ail')) {
            return '#FFEDD5';
        }
        if (name.includes('potiron') || name.includes('courgette') || name.includes('concombre') || name.includes('mais') || name.includes('maïs')) {
            return '#FEF9C3';
        }

        return '#E0F2FE';
    }

    function getVegetableName(vegetableId: string): string {
        const vegetable = vegetablesContext.find((v) => v.id === vegetableId);
        return vegetable ? vegetable.name : '';
    }

    function getStyle(rowId: number, colId: number, col: { vegetableId?: string | undefined }) {
        if (celIsFocus(colId, rowId)) {
            return styles.focusOnCel
        }
        if (col.vegetableId) {
            return [
                styles.colSelected,
                { backgroundColor: getCellBackgroundColor(col.vegetableId) }
            ]
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
                                                <>
                                                    <View style={styles.vegeContentContainer}>
                                                        <Image source={getIconUrl(col.vegetableId)}
                                                            style={styles.vegeIcon} />
                                                        <Text style={styles.vegeLabel} numberOfLines={1}>
                                                            {getVegetableName(col.vegetableId)}
                                                        </Text>
                                                    </View>
                                                    <View style={styles.quantityBadge}>
                                                        <Text style={styles.quantityText}>1x</Text>
                                                    </View>
                                                </>
                                                :
                                                <View style={styles.dot}></View>
                                        }
                                    </Pressable>
                                ))}
                            </View>
                        ))
                    }

                    {
                        relations.map((rel, idx) => {
                            const left = rel.type === 'horizontal' ? rel.col * 72 + 60 : rel.col * 72 + 24;
                            const top = rel.type === 'horizontal' ? rel.row * 72 + 24 : rel.row * 72 + 60;
                            const backgroundColor = rel.relation === 'affinity' ? '#10B981' : '#EF4444';

                            return (
                                <View
                                    key={`rel-${idx}`}
                                    style={[
                                        styles.relationIndicator,
                                        {
                                            left,
                                            top,
                                            backgroundColor,
                                        }
                                    ]}
                                    pointerEvents="none"
                                >
                                    {rel.relation === 'affinity' ? (
                                        <View style={styles.affinityInnerDot} />
                                    ) : (
                                        <Text style={styles.badNeighborText}>×</Text>
                                    )}
                                </View>
                            );
                        })
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
        borderColor: '#3B82F6',
        backgroundColor: '#F4EFE8',
        transform: [{ scale: 1.15 }],
        zIndex: 2
    },
    vegeContentContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 6,
        paddingBottom: 2,
    },
    vegeIcon: {
        width: 32,
        height: 32,
    },
    vegeLabel: {
        fontSize: 8,
        fontWeight: '700',
        color: '#1F2937',
        marginTop: 2,
        textAlign: 'center',
        width: '90%',
    },
    quantityBadge: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        backgroundColor: '#FFFFFF',
        borderRadius: 4,
        paddingHorizontal: 4,
        paddingVertical: 1,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        zIndex: 3,
    },
    quantityText: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#4B5563',
    },
    relationIndicator: {
        position: 'absolute',
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 1.5,
        borderColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        elevation: 2,
        zIndex: 5,
    },
    affinityInnerDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#FFFFFF',
    },
    badNeighborText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginTop: -2,
    },
});