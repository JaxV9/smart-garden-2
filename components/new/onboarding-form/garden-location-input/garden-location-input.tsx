import { Commune, useLocation } from "@/hooks/useLocation";
import { useEffect } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

interface GardenLocationInputProps {
    setGardenLocation: React.Dispatch<React.SetStateAction<string | undefined>>
}

export function GardenLocationInput({ setGardenLocation }: GardenLocationInputProps) {

    const { currentDepartement, departmentInputText, departments,
        departementPropositions, communesPropositions, communeInputText, loadDepartments,
        departmentListener, communesListener, selectDepartment, selectCommune } = useLocation();

    function handleSelectCommune(commune: Commune): void {
        selectCommune(commune);
        setGardenLocation(`${commune.code} - ${commune.nom}`)
    }

    useEffect(() => {
        if (departments.length === 0) {
            loadDepartments()
        }
    }, [departments])

    return (
        <View>
            <View>
                <TextInput style={styles.input} placeholder="Département" placeholderTextColor="#111827" onChangeText={(event) => departmentListener(event)}
                    value={departmentInputText} />
                {departementPropositions.length > 0 &&
                    <View style={styles.propositionsContainer}>
                        {
                            departementPropositions.map((departementProposition, index) => (
                                <Pressable key={index} onPress={() => selectDepartment(departementProposition)}>
                                    <Text style={styles.labelDepartment}>
                                        {departementProposition.code} - {departementProposition.nom}
                                    </Text>
                                </Pressable>
                            ))
                        }
                    </View>
                }
            </View>
            <View>
                {
                    currentDepartement &&
                    <>
                        <TextInput style={styles.input} placeholder="Ville" placeholderTextColor="#111827" onChangeText={(event) => communesListener(event)}
                            value={communeInputText} />
                        <View style={styles.propositionsContainer}>
                            {
                                communesPropositions.map((communeProposition, index) => (
                                    <Pressable key={index} onPress={() => handleSelectCommune(communeProposition)}>
                                        <Text style={styles.labelDepartment}>
                                            {communeProposition.code} - {communeProposition.nom}
                                        </Text>
                                    </Pressable>
                                ))
                            }
                        </View>
                    </>
                }
            </View>
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
    },
    propositionsContainer: {
        marginLeft: 16,
        marginRight: 16,
        padding: 8,
        gap: 8,
        marginTop: -8,
        backgroundColor: '#F8FAF8',
    },
    labelDepartment: {
        fontSize: 14
    },
});
