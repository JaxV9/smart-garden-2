import { BackButton } from "@/components/new/backButton/backButton";
import { Plan } from "@/components/new/plan/plan";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Header } from "@/components/new/header/header";

export default function Index() {


    return (
        <View style={styles.container}>
            <Header/>

            <View style={styles.backButton}>
                <BackButton callback={() => router.replace('/home')} />
            </View>

            <Plan />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
    backButton: {
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 8,
        zIndex: 1,
    }
});