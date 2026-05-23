import { Plan } from "@/components/new/plan/plan";
import AppHeader from "@/components/new/ui/AppHeader";
import { StyleSheet, View } from "react-native";

export default function Index() {
    return (
        <View style={styles.container}>
            <Plan />
            <View style={styles.headerContainer}>
                <AppHeader
                    title="Plan"
                    showBack={true}
                    showNotifications={true}
                    fallbackRoute="/home"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    headerContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
    },
});