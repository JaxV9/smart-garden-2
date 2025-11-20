import { Header } from "@/components/header/header";
import { VegetableCard } from "@/components/vegetablesList/vegetable/vegetable";
import { VegetablesList } from "@/components/vegetablesList/vegetableList";
import { useVegetablesContext } from "@/contexts/vegetables.context";
import { router } from "expo-router";
import { useEffect } from "react";
import { ScrollView, StyleSheet } from "react-native";

export default function Index() {

    const { vegetablesContext, loadVegetables } = useVegetablesContext()

    useEffect(() => {
        loadVegetables()
    }, [])

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Header title="Rechercher" />
            <VegetablesList>
                {vegetablesContext?.map((vegetable, index) => (
                    <VegetableCard key={index} vegetable={vegetable} callBack={() => router.push(`/vegetable/${vegetable.id}`)} />
                ))}
            </VegetablesList>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingTop: "15%",
        paddingLeft: 16,
        paddingRight: 16,
        paddingBottom: 100,
        backgroundColor: "#FFFDF0",
    }
});