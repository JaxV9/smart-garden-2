import { StyleSheet, View } from "react-native";
import { Task } from "@/components/new/task/task";
import { router } from "expo-router";
import { BackButton } from "@/components/new/backButton/backButton";
import { Header } from "@/components/new/header/header";

export default function Index() {
  return (
    <View style={styles.container}>
      <Header/>

      <View style={styles.actionsRow}>
        <BackButton callback={() => router.replace("/home")} />
      </View>

      <Task />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  actionsRow: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
});
