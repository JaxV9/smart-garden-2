import { StyleSheet, TextInput, View } from "react-native";

interface GardenNameInputProps {
    gardenName: string | undefined,
    setGardenName: React.Dispatch<React.SetStateAction<string | undefined>>
}

export function GardenNameInput({ gardenName, setGardenName }: GardenNameInputProps) {

    return (
        <View>
            <TextInput style={styles.input} placeholder="Nom du jardin" placeholderTextColor="#111827" onChangeText={setGardenName} value={gardenName} />
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
