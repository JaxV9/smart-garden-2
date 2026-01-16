import { GardenVegetable } from "@/models/models";
import { Image } from "expo-image";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

interface GardenVegeList {
    gardenVegetables: GardenVegetable[],
    closeIsUpdatingCel: () => void,
    updateCelWithVege: (vegetable: GardenVegetable) => void
}

export const GardenVegeList = ({ gardenVegetables, closeIsUpdatingCel, updateCelWithVege }: GardenVegeList) => {

    function selectVegetable(vegetable: GardenVegetable): void {
        updateCelWithVege(vegetable)
    }

    return (
        <View style={styles.container}>
            <Pressable onPress={() => closeIsUpdatingCel()}>
                <Image
                    source={require('@/assets/icons/delete.svg')}
                    style={styles.icon}
                />
            </Pressable>
            <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {
                    gardenVegetables.map((gardenVegetable, index) => (
                        <Pressable onPress={() => selectVegetable(gardenVegetable)} key={index} style={styles.vegetable}>
                            <Text style={styles.vegeIcon}>🌱​</Text>
                            <Text style={styles.vegeLabel}>{gardenVegetable.name}</Text>
                        </Pressable>
                    ))
                }
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: '0%',
        borderWidth: 1,
        width: '100%',
        height: 'auto',
        borderColor: '#9c9a9774',
        backgroundColor: '#F9FAFB',
        paddingTop: 8,
        paddingBottom: 28,
        paddingLeft: 8,
        gap: 8
    },
    scrollContent: {
        flexDirection: 'row',
        gap: 16,
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    vegetable: {
        width: 100,
        height: 100,
        borderWidth: 1,
        borderRadius: 16,
        borderColor: '#9c9a9774',
        backgroundColor: '#DCFCE7'
    },
    icon: {
        width: 32,
        height: 32,
        marginLeft: 'auto',
        marginRight: 8,
    },
    vegeIcon: {
        fontSize: 28,
        margin: 'auto'
    },
    vegeLabel: {
        margin: 'auto',
        fontSize: 16
    }
});