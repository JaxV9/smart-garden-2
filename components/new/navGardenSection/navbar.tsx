import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type HomeSection = 'resume' | 'plants' | 'sensors'

type NavBarGardenSectionType = {
  currentSectionProps: HomeSection,
  setCurrentSectionProps: React.Dispatch<React.SetStateAction<HomeSection>>
}

export const NavBarGardenSection = ({ currentSectionProps, setCurrentSectionProps }: NavBarGardenSectionType) => {


  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity style={[styles.button, currentSectionProps === "resume" && styles.selected]}
          onPress={() => setCurrentSectionProps('resume')}>
          <Text style={styles.text} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>
            Resume
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, currentSectionProps === "plants" && styles.selected]}
          onPress={() => setCurrentSectionProps('plants')}>
          <Text style={styles.text} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>
            Plantes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, currentSectionProps === "sensors" && styles.selected]}
          onPress={() => setCurrentSectionProps('sensors')}>
          <Text style={styles.text} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>
            Capteurs
          </Text>
        </TouchableOpacity>
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
    flex: 1,
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 6,
    paddingRight: 6,
    borderRadius: 20
  },
  selected: {
    backgroundColor: "#D7DCC7",
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  }
});
