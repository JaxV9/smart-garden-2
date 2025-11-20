import GardenSection from "@/components/garden-section";
import { Header } from "@/components/header/header";
import { NavBarGardenSection } from "@/components/navGardenSection/navbar";
import { Planning } from "@/components/planning/planning";
import { SensorCard } from "@/components/sensor/sensorCard";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function Index() {
    const [currentSection, setCurrentSection] = useState<string>('plantes');
    const [error, setError] = useState<string | null>(null);

    const fakeMeasures = [
        {
            temperature: '25°',
            luminosity: '71%',
            humidity: '50%',
        },
        {
            temperature: '32°',
            luminosity: '75%',
            humidity: '40%',
        }
    ]
    return (
        <View style={styles.container}>
            <View>
                <Header title={"Mon potager"} />
                <NavBarGardenSection currentSectionProps={currentSection} setCurrentSectionProps={setCurrentSection} />
            </View>
            <ScrollView style={styles.scrollViewContainer}>
                {error && (
                    <Text style={styles.error}>{error}</Text>
                )}
                {currentSection === 'plantes' && (
                    <GardenSection />
                )}
                {currentSection === 'calendrier' && (
                    <>
                        <Planning />
                    </>
                )}
                {currentSection === 'capteurs' && (
                    <View style={styles.sensorsContainer}>
                        <SensorCard name='Capteur 1' measures={fakeMeasures[0]} />
                        <SensorCard name='Capteur 2' measures={fakeMeasures[1]} />
                    </View>
                )}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        paddingTop: "15%",
        gap: 16,
        backgroundColor: "#FFFDF0",
    },
    scrollViewContainer: {
        width: '100%',
    },
    error: {
        fontSize: 18,
        textAlign: "center",
        width: "85%",
        marginBottom: 16,
        fontWeight: 500,
        color: "red",
    },
    sensorsContainer: {
        width: "90%",
        marginLeft: "auto",
        marginRight: "auto",
        gap: 16
    }
});