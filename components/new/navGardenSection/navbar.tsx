import { StyleSheet, View } from 'react-native';

export type HomeSection = 'resume' | 'plants'

type NavBarGardenSectionType = {
  currentSectionProps: HomeSection,
  setCurrentSectionProps: React.Dispatch<React.SetStateAction<HomeSection>>
}

export const NavBarGardenSection = ({ currentSectionProps, setCurrentSectionProps }: NavBarGardenSectionType) => {


  return (
    <>
      <View style={styles.container}>
        {/* <TouchableOpacity style={[styles.button, currentSectionProps === "plants" && styles.selected]}
          onPress={() => setCurrentSectionProps('plants')}>
          <Text style={styles.text}>Plantes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, currentSectionProps === "tasks" && styles.selected]}
          onPress={() => setCurrentSectionProps('tasks')}>
          <Text style={styles.text}>Tâches</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, currentSectionProps === "calendar" && styles.selected]}
          onPress={() => setCurrentSectionProps('calendar')}>
          <Text style={styles.text}>Calendrier</Text>
        </TouchableOpacity> */}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
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