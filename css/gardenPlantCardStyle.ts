import { StyleSheet } from "react-native";

export const gardenPlantCardStyles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 3,
  },

  image: {
    width: "100%",
    height: 220,
    backgroundColor: "#F3F4F6",
  },

  placeholder: {
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  placeholderText: {
    fontSize: 28,
    fontWeight: "900",
    color: "#6B7280",
  },

  title: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 14,
    fontSize: 18,
    color: "#111827",
    fontWeight: "800",
  },
});
