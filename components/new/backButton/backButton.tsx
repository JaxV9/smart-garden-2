import { Image } from "expo-image";
import { Pressable, StyleSheet } from "react-native";

interface BackButtonProps {
    callback: () => void
}

export function BackButton({ callback }: BackButtonProps) {

    return (
        <Pressable onPress={() => callback()} style={styles.container}>
            <Image
                source={require('@/assets/icons/arrow-left.svg')}
                style={styles.icon}
            />
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        width: 32,
        height: 'auto',
        top: 0,
        left: 0,
    },
    icon: {
        width: 32,
        height: 32,
        margin: 'auto',
        color: 'black'
    }
});
