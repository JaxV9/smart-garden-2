import { BackButton } from "@/components/new/backButton/backButton";
import { Plan } from "@/components/new/plan/plan";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";


export default function Index() {


    return (
        <View style={styles.container}>
            <View style={styles.backButton}>
                <BackButton callback={() => router.replace('/home')} />
            </View>
            <Plan />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F9FAFB',
        paddingTop: 64,
        paddingBottom: 50,
        gap: 16,
        height: '100%'
    },
    backButton: {
        zIndex: 3,
        paddingLeft: 8,
    }
});