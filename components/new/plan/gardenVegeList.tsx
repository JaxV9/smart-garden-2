import { GardenVegetable } from "@/models/models";
import { Image } from "expo-image";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

interface GardenVegeList {
    gardenVegetables: GardenVegetable[],
    closeIsUpdatingCel: () => void,
    updateCelWithVege: (vegetable: string | undefined) => void,
    vegeId?: string
}

export const GardenVegeList = ({ gardenVegetables, closeIsUpdatingCel, updateCelWithVege, vegeId }: GardenVegeList) => {

    function selectVegetable(vegetable: GardenVegetable): void {
        updateCelWithVege(vegetable.id)
    }

    function clearCell(): void {
        updateCelWithVege(undefined)
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
                {vegeId !== undefined &&
                    <Pressable onPress={() => clearCell()} style={styles.delete}>
                        <Image source={'https://outamtvthkoviplxcznc.supabase.co/storage/v1/object/public/vegetables/icons/xmark.svg'} style={styles.vegeIcon} />
                    </Pressable>
                }
                {
                    gardenVegetables.map((gardenVegetable, index) => (
                        <Pressable onPress={() => selectVegetable(gardenVegetable)} key={index} style={styles.vegetable}>
                            <Image source={gardenVegetable.icons} style={styles.vegeIcon} />
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
    delete: {
        width: 100,
        height: 100,
        borderWidth: 1,
        borderRadius: 16,
        borderColor: '#9c9a9774',
        backgroundColor: '#ff8d8dff'
    },
    icon: {
        width: 32,
        height: 32,
        marginLeft: 'auto',
        marginRight: 8,
    },
    vegeIcon: {
        width: 64,
        height: 64,
        margin: 'auto'
    },
    vegeLabel: {
        margin: 'auto',
        fontSize: 16
    },
    deleteLabel: {
        margin: 'auto',
        fontSize: 16,
        color: '#fff'
    }
});