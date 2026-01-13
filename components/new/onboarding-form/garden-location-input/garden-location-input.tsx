import { StyleSheet, TextInput, View } from "react-native";

interface GardenLocationInputProps {
    gardenLocation: string | undefined,
    setGardenLocation: React.Dispatch<React.SetStateAction<string | undefined>>
}

export function GardenLocationInput({ gardenLocation, setGardenLocation }: GardenLocationInputProps) {

    return (
        <View>
            <TextInput style={styles.input} placeholder="Localisation" onChangeText={setGardenLocation} value={gardenLocation} />
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
        backgroundColor: '#F8FAF8',
        padding: 16,
        fontSize: 16,
        width: '90%',
        margin: 'auto',
        marginTop: 28,
        borderRadius: 8
    }
});
