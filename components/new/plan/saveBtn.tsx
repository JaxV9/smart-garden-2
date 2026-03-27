import { Image } from "expo-image"
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native"

interface SaveBtnProps {
    isSaving: boolean,
    callback: () => void,
    shouldSave: boolean
}

export const SaveBtn = ({ isSaving, callback, shouldSave }: SaveBtnProps) => {

    return (
        <View style={styles.saveIconContainer}>
            {
                isSaving && shouldSave &&
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#1465108e" />
                </View>
            }
            {
                !isSaving && shouldSave &&
                <Pressable onPress={() => callback()}>
                    <Image
                        source={require('@/assets/icons/save.svg')}
                        style={styles.saveIcon}
                    />
                </Pressable>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    saveIconContainer: {
        width: 32,
        height: 32,
        marginLeft: 'auto',
        marginRight: 16,
        zIndex: 200,
    },
    saveIcon: {
        width: 32,
        height: 32,
        color: 'black'
    },
    loaderContainer: {
        width: 32,
        height: 32,
        marginLeft: 'auto',
        marginRight: 16,
        zIndex: 200,
        justifyContent: 'center',
        alignItems: 'center',
    }
});