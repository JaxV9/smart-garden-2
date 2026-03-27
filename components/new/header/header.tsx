import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type HeaderPropsType = {
  title?: string;
};

export const Header = ({ title = "dsfdsfsdfdsfds" }: HeaderPropsType) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Ionicons name="leaf-outline" size={20} color="#FFFFFF" />
        <Text style={styles.headerTitle}>{title}</Text>
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
    backgroundColor: '#5A7F54',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
