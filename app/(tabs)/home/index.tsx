import { ResumeSection } from '@/components/new/homeSections/resumeSection/resumeSection';
import { HomeSection, NavBarGardenSection } from '@/components/new/navGardenSection/navbar';
import { SensorsSection } from '@/components/new/sensors/sensorsSection';
import { useVegetablesContext } from '@/contexts/vegetables.context';
import { useGarden } from '@/hooks/useGarden';
import { useVegetable } from '@/hooks/useVegetable';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';


export default function Index() {
    const [currentSection, setCurrentSection] = useState<HomeSection>('resume')
    const { loadGardenVegetables } = useGarden()
    const { vegetablesContext } = useVegetablesContext()
    const { loadVegetables } = useVegetable()

    useEffect(() => {
        loadVegetables()
    }, [])

    useEffect(() => {
        if (vegetablesContext.length > 0) {
            loadGardenVegetables()
        }
    }, [vegetablesContext])

    return (
        <View style={styles.container}>
            <View style={styles.gap16}>
                <Text style={styles.title}>Mon jardin</Text>
                <NavBarGardenSection currentSectionProps={currentSection}
                    setCurrentSectionProps={setCurrentSection} />
            </View>
            {
                currentSection === 'resume' &&
                <ResumeSection />
            }
            {currentSection === 'plants' &&
                <View style={styles.placeholderCard}>
                    <Text style={styles.placeholderText}>Section plantes a venir.</Text>
                </View>
            }
            {currentSection === 'sensors' &&
                <SensorsSection />
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 64,
        paddingLeft: 8,
        paddingRight: 8,
        gap: 16,
        backgroundColor: '#F9FAFB'
    },
    gap16: {
        gap: 16
    },
    title: {
        fontSize: 22
    },
    gap8: {
        gap: 8
    },
    placeholderCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    placeholderText: {
        fontSize: 14,
        color: '#6B7280',
    },
});
