
import { useGardenContext } from '@/contexts/garden.context';
import { usePlan } from '@/hooks/usePlan';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AreaManager } from './areaManager';
import { GardenVegeList } from './gardenVegeList';
import { SaveBtn } from './saveBtn';
import { Space } from './space';
import { Touch } from './touch';
import { ZoomItem } from './zoom';

export const Plan = () => {
    const { gardenVegetables } = useGardenContext()

    const { scale, gardenSpaces, isUpdatingCel, spaceEditing, hasGarden, isSaving,
        shouldSave, toggleSpaceEditor, updateCelWithVege, editCel,
        setScale, addNewSpace, updateSpaceName,
        setGardenSpaces, closeIsUpdatingCel, saveGardenSpaces, celData } = usePlan()

    return (
        <View style={styles.container}>
            <SaveBtn isSaving={isSaving} shouldSave={shouldSave} callback={saveGardenSpaces} />
            <Touch scale={scale} isAbsolute={true}>
                {
                    gardenSpaces.map((gardenSpace) => (
                        <Space key={gardenSpace.spaceName} gardenSpace={gardenSpace} scale={scale} editCel={editCel}
                            toggleSpaceEditor={toggleSpaceEditor} updateSpaceName={updateSpaceName} isUpdatingCel={isUpdatingCel} />
                    ))
                }
            </Touch>
            {
                !hasGarden ?
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
                                    closeIsUpdatingCel={closeIsUpdatingCel} updateCelWithVege={updateCelWithVege}
                                    vegeId={celData?.vegeId} />
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
        top: 120,
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
        height: 50,
        borderRadius: 14,
        backgroundColor: "#5A7F54",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
        shadowColor: '#5A7F54',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 2,
    },
    btnTxt: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "700",
    },
    saveIconContainer: {
        width: 32,
        height: 32,
        marginLeft: 'auto',
        marginRight: 16,
        zIndex: 200
    },
    saveIcon: {
        width: 32,
        height: 32,
        color: 'black'
    }
});