import { VegetableCard } from "@/components/vegetablesList/vegetable/vegetable";
import { VegetablesList } from "@/components/vegetablesList/vegetableList";
import { useGardenContext } from "@/contexts/garden.context";
import { useVegetablesContext } from "@/contexts/vegetables.context";
import { Vegetable } from "@/models/models";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";


export default function AddVegetable() {

    const [error, setError] = useState<string | null>(null);
    const { loadGardenVegetables, addVegetableToGarden } = useGardenContext()
    const { vegetablesContext } = useVegetablesContext()

    const loadVegetables = async () => {
        const response = await loadGardenVegetables();
        if (response === "Failure") {
            setError('Erreur de chargement');
        }
    }

    const addVegetable = async (vegetable: Vegetable): Promise<void> => {
        if (!vegetable.id) {
            return
        }
        const response = await addVegetableToGarden(vegetable);
        if (response === 'Failure') {
            setError('Error');
            return
        }
        loadVegetables()
        router.back();
    }

    return (
        <>
            <ScrollView contentContainerStyle={styles.container}>
                <VegetablesList>
                    {vegetablesContext?.map((vegetable, index) => (
                        <VegetableCard key={index} vegetable={vegetable} callBack={() => addVegetable(vegetable)} />
                    ))}
                </VegetablesList>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingTop: 50,
        paddingLeft: 16,
        paddingRight: 16
    },
});
