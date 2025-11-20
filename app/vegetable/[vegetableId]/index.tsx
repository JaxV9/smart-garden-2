import { VegetableCard } from "@/components/vegetablesList/vegetable/vegetable";
import { VegetablesList } from "@/components/vegetablesList/vegetableList";
import { useVegetablesContext } from "@/contexts/vegetables.context";
import { Vegetable } from "@/models/models";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";


export default function Index() {
    const [currentVegetable, setCurrentVegetable] = useState<Vegetable>();
    const { vegetableId } = useLocalSearchParams();
    const { vegetablesContext } = useVegetablesContext()

    const getVegetable = (name: string): Vegetable | undefined => {
        const vegetable = vegetablesContext.find((vegetable) => vegetable.name === name);
        if (!vegetable) {
            return undefined;
        }
        return vegetable;
    }

    useEffect(() => {
        const vegetable = vegetablesContext.find((vegetable => vegetable.id === vegetableId));
        setCurrentVegetable(vegetable);
    }, [])

    return (
        <>
            <ScrollView style={styles.container}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.push(`/search`)}>
                    <Image
                        source={require('@/assets/icons/arrow-left.svg')}
                        style={styles.arrowLeft}
                    />
                </TouchableOpacity>
                <Image source={{ uri: currentVegetable?.images[0] }} style={styles.vegetableImage} />
                <View style={styles.vegetableDescriptionContainer}>
                    <Text style={styles.title}>{currentVegetable?.name}</Text>
                    <View style={styles.section}>
                        <Text style={styles.subTitle}>Description</Text>
                        <Text style={styles.description}>{currentVegetable?.description}</Text>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.subTitle}>Caractéristiques</Text>
                        <View style={styles.specsContainer}>
                            {currentVegetable?.specifications.map((spec, index) => (
                                <View key={index} style={styles.specsLabel}>
                                    <Text>{spec}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.subTitle}>Plantes amies</Text>
                        <VegetablesList>
                            {currentVegetable?.affinity.map((vegetable, index) => {
                                const foundVegetable = getVegetable(vegetable);
                                return foundVegetable ? (
                                    <VegetableCard key={index} vegetable={foundVegetable} callBack={() => router.push(`/vegetable/${foundVegetable.id}`)} />
                                ) : null;
                            })}
                        </VegetablesList>
                    </View>
                    {currentVegetable && currentVegetable.bad_neighbors.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.subTitle}>Plantes ennemies</Text>
                            <VegetablesList>
                                {currentVegetable?.bad_neighbors.map((vegetable, index) => {
                                    const foundVegetable = getVegetable(vegetable);
                                    return foundVegetable ? (
                                        <VegetableCard key={index} vegetable={foundVegetable} callBack={() => router.push(`/vegetable/${foundVegetable.id}`)} />
                                    ) : null;
                                })}
                            </VegetablesList>
                        </View>
                    )}

                </View>
            </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 32,
        backgroundColor: "#FFFDF0",
    },
    backButton: {
        backgroundColor: '#BABABA',
        display: 'flex',
        opacity: 0.8,
        width: 50,
        height: 50,
        position: 'absolute',
        left: 16,
        top: 32,
        borderRadius: '50%',
        zIndex: 2
    },
    arrowLeft: {
        margin: 'auto',
        width: 32,
        height: 32
    },
    vegetableImage: {
        width: '100%',
        height: 500,
        margin: 'auto'
    },
    vegetableDescriptionContainer: {
        width: '100%',
        height: '100%',
        backgroundColor: "#FFFDF0",
        position: 'relative',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        top: -250,
        gap: 28,
        padding: 28,
        paddingBottom: 100
    },
    title: {
        fontSize: 28,
        fontWeight: 500,
        color: '#5B8E55'
    },
    subTitle: {
        fontSize: 20,
        fontWeight: 500,
        color: '#394434'
    },
    description: {
        fontSize: 13,
        color: '#60655D'
    },
    section: {
        gap: 4
    },
    specsContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        gap: 8
    },
    specsLabel: {
        backgroundColor: "#D7DCC7",
        borderRadius: 16,
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 4,
        paddingBottom: 4,
    },
});