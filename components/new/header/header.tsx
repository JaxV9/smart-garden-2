import { useGardenContext } from "@/contexts/garden.context";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

type HeaderPropsType = {
  title?: string;
};

export const Header = ({ title }: HeaderPropsType) => {
  const { gardenInfo } = useGardenContext();

  const headerTitle = title ?? gardenInfo?.name ?? "Mon Jardin";

  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Ionicons name="leaf-outline" size={20} color="#FFFFFF" />
        <Text style={styles.headerTitle}>{headerTitle}</Text>
      </View>
      <Ionicons name="notifications-outline" size={20} color="#FFFFFF" />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 92,
    paddingTop: 44,
    paddingHorizontal: 18,
    backgroundColor: "#5A7F54",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});