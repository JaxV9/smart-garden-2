import { Plan } from "@/components/new/plan/plan";
import AppHeader from "@/components/new/ui/AppHeader";
import { StyleSheet, View } from "react-native";

export default function Index() {
    return (
        <View style={styles.container}>
            <AppHeader
                title="Plan"
                showBack={true}
                showNotifications={true}
                fallbackRoute="/home"
            />

            <Plan />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
});