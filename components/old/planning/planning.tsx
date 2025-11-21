import { useGardenContext } from "@/contexts/garden.context";
import { ScrollView, StyleSheet, Text, View } from "react-native";


export const Planning = () => {
  const { gardenVegetables } = useGardenContext()

  const months = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  function giveTheCorrectWithAndPositionSowing(properties: string[]) {
    const lowerMonths = months.map(el => el.toLowerCase());
    const startMonth = lowerMonths.findIndex(element => element === properties[0])
    const lastMonth = lowerMonths.findIndex(element => element === properties[properties.length - 1])

    const multipleWidth = 50;
    const multiplePosition = 110;
    const width = 80 + (lastMonth * multipleWidth);
    const left = 10 + (startMonth * multiplePosition)

    return {
      width,
      left
    }
  }

  return (
    <>
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollContainer}
          showsHorizontalScrollIndicator={true}
        >
          <View style={styles.monthLabelContainer}>
            <View style={styles.space} />
            {months.map((month) => (
              <Text style={styles.monthLabel} key={month}>
                {month}
              </Text>
            ))}
          </View>
          <View style={styles.vegetablesContainer}>
            {gardenVegetables?.map((vegetable, index) => (
              <View key={index} style={styles.vegetableElement}>
                <View style={styles.vegetableLabelContainer}>
                  <Text style={styles.marginAuto}>{vegetable.name}</Text>
                </View>
                <View style={styles.planningContainer}>
                  {vegetable.sowing.length > 0 && (
                    <View style={[styles.sowing, styles.planningItem, giveTheCorrectWithAndPositionSowing(vegetable.sowing)]}>
                      <Text style={styles.marginAuto}>Semis</Text>
                    </View>
                  )}
                  {vegetable.plantation.length > 0 && (
                    <>
                      <View style={[styles.plantation, styles.planningItem, giveTheCorrectWithAndPositionSowing(vegetable.plantation)]}>
                        <Text style={styles.marginAuto}>Plantation</Text>
                      </View>
                    </>
                  )}
                  {vegetable.harvest.length > 0 && (
                    <>
                      <View style={[styles.harvest, styles.planningItem, giveTheCorrectWithAndPositionSowing(vegetable.harvest)]}>
                        <Text style={styles.marginAuto}>Récolte</Text>
                      </View>
                    </>
                  )}
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "auto",
    display: "flex",
    flexDirection: "row",
  },
  monthLabelContainer: {
    width: "auto",
    display: "flex",
    flexDirection: "row",
    gap: 64,
    paddingTop: 50,
    paddingBottom: 16,
    paddingLeft: 16,
    paddingRight: 16,
    marginBottom: 8,
  },
  space: {
    width: 40,
  },
  scrollContainer: {
    height: "auto",
    display: "flex",
    flexDirection: "row",
  },
  monthLabel: {
    fontSize: 14,
    transform: [{ rotate: "-25deg" }],
    textAlign: "left",
  },
  vegetablesContainer: {
    display: "flex",
    flexDirection: "column",
    borderTopColor: "#E2E2E2",
    borderTopWidth: 1,
  },
  vegetableElement: {
    width: "100%",
    height: 110,
    borderBottomColor: "#E2E2E2",
    borderBottomWidth: 1,
    display: "flex",
    flexDirection: "row",
  },
  vegetableLabelContainer: {
    width: 100,
    left: 0,
    top: 0,
    height: "100%",
    backgroundColor: "FFFDF0",
    borderRightColor: "#E2E2E2",
    borderRightWidth: 1,
    boxShadow: "6px 0px 33px -13px rgba(52, 52, 57, 0.18)",
  },
  marginAuto: {
    margin: "auto",
  },
  planningContainer: {
    padding: 8,
    gap: 4,
    marginTop: "auto",
    marginBottom: "auto"
  },
  planningItem: {
    position: "relative",
    height: 28,
    borderRadius: 16,
    overflow: "hidden",
  },
  sowing: {
    backgroundColor: "#E7C2A0",
  },
  plantation: {
    backgroundColor: "#EBECD2",
  },
  harvest: {
    backgroundColor: "#E7BDBB",
  },
});
