import { BackButton } from "@/components/new/backButton/backButton";
import { Plan } from "@/components/new/plan/plan";
import { Header } from "@/components/new/header/header";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function Index() {
    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Header />
            </View>
            <View style={styles.backButtonRow}>
                <BackButton callback={() => router.replace('/home')} />
            </View>
            <Plan />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        paddingTop: 64,
        paddingBottom: 50,
        height: '100%'
    },
    headerContainer: {
        paddingHorizontal: 20,
        paddingBottom: 10,
    },
    backButtonRow: {
        paddingHorizontal: 20,
        marginBottom: 8,
        zIndex: 10,
    },
});