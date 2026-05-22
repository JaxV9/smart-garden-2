import { BackButton } from "@/components/new/backButton/backButton";
import { Plan } from "@/components/new/plan/plan";
import { Header } from "@/components/new/header/header";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Header />
            </View>
            <View style={styles.navRow}>
                <View style={styles.backButtonContainer}>
                    <BackButton callback={() => router.replace('/home')} />
                </View>
                <Text style={styles.pageTitle}>Plan du jardin</Text>
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
        marginBottom: 4,
    },
    navRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        paddingHorizontal: 20,
        height: 40,
        marginBottom: 8,
        zIndex: 10,
    },
    backButtonContainer: {
        position: 'absolute',
        left: 20,
        zIndex: 10,
    },
    pageTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: '#111827',
    }
});