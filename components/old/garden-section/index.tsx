import { useBottomSheet } from "@/contexts/bottomSheetContext";
import { useGardenContext } from "@/contexts/garden.context";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { VegetableCardGarden } from "../vegetableCardGarden/vegetableCardGarden";
import { VegetablesGardenList } from "../vegetableCardGarden/vegetablesGardenList";

export default function GardenSection() {

    const [error, setError] = useState<string | null>(null)
    const { show, hide } = useBottomSheet()
    const { loadGardenVegetables, removeVegetablesFromGarden, gardenVegetables } = useGardenContext()

    const openBottomSheet = (vegetableId: string) => {
        show(
            <>
                <TouchableOpacity onPress={() => removeVegetable(vegetableId)} style={styles.removeVegetableBtn}>
                    <Text style={styles.removeVegetable}>Supprimer ce végétal</Text>
                </TouchableOpacity>
            </>
        )
    }

    const loadVegetables = async () => {
        const response = await loadGardenVegetables();
        if (response === "Failure") {
            setError('Erreur de chargement');
        }
    }

    const removeVegetable = async (vegetableId: string) => {
        const response = await removeVegetablesFromGarden(vegetableId);
        if (response === 'Failure') {
            return setError('Erreur')
        }
        loadVegetables()
        hide()
    }

    const moveToDetails = (vegetableId: string) => {
        router.push(`/vegetable/${vegetableId}`)
        hide()
    }
    return (
        <>
            <View style={styles.gardenContainer}>
                {gardenVegetables?.length > 0 && (
                    <VegetablesGardenList>
                        {gardenVegetables.map((vegetable, index) => (
                            <VegetableCardGarden key={index}
                                label={vegetable.name} image={{ uri: vegetable.images[0] }}
                                onLongPressCallback={() => openBottomSheet(vegetable.gardenVegetableId)}
                                callback={() => moveToDetails(vegetable.id)}
                            />
                        ))}
                    </VegetablesGardenList>
                )}
                <TouchableOpacity onPress={() => router.push('/add-vegetable')} style={styles.button}>
                    <Text style={styles.addVegetableText}>Agrandir mon potager</Text>
                </TouchableOpacity>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    gardenContainer: {
        width: '90%',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    button: {
        width: "100%",
        paddingTop: 16,
        paddingBottom: 16,
        color: "#345624",
        borderWidth: 1,
        borderRadius: 8,
        marginTop: 50,
        marginBottom: 50,
        marginLeft: "auto",
        marginRight: "auto"
    },
    addVegetableText: {
        fontSize: 18,
        textAlign: "center"
    },
    removeVegetableBtn: {
        width: "100%",
        paddingTop: 16,
        paddingBottom: 16,
        color: "#e3381eff",
        borderWidth: 1,
        borderRadius: 8,
        marginTop: 50,
        marginBottom: 50,
        marginLeft: "auto",
        marginRight: "auto"
    },
    removeVegetable: {
        fontSize: 18,
        textAlign: "center",
    }
});
