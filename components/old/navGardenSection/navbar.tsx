import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native';

type NavBarGardenSectionType = {
  currentSectionProps: string,
  setCurrentSectionProps: React.Dispatch<React.SetStateAction<string>>
}

export const NavBarGardenSection = ({ currentSectionProps, setCurrentSectionProps }: NavBarGardenSectionType) => {


  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity style={[styles.button, currentSectionProps === "plantes" && styles.selected]} onPress={() => setCurrentSectionProps('plantes')}>
          <Text style={styles.text}>Plantes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, currentSectionProps === "calendrier" && styles.selected]} onPress={() => setCurrentSectionProps('calendrier')}>
          <Text style={styles.text}>Calendrier</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, currentSectionProps === "capteurs" && styles.selected]} onPress={() => setCurrentSectionProps('capteurs')}>
          <Text style={styles.text}>Capteurs</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    height: "auto",
    padding: 4,
    display: 'flex',
    flexDirection: 'row',
    borderWidth: 1,
    justifyContent: 'space-between',
    borderRadius: 22,
    borderColor: "#E2E2E2"
  },
  button: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 20
  },
  selected: {
    backgroundColor: "#D7DCC7",
  },
  text: {
    fontSize: 18,
  }
});
