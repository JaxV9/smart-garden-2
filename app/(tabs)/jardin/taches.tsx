import { StyleSheet, View } from 'react-native';
import { HomeSection, NavBarGardenSection } from '@/components/new/navGardenSection/navbar';
import { useState } from 'react';
import { Task } from '@/components/new/task/task';

export default function Index() {

    const [currentSection, setCurrentSection] = useState<HomeSection>('tasks')

    return (
            <View style={styles.container}>
                <NavBarGardenSection currentSectionProps={currentSection}
                    setCurrentSectionProps={setCurrentSection} />
                {currentSection === 'tasks' &&
                    <Task />
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
    }
});