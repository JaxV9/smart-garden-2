import { CalendarComp } from '@/components/new/calendar/calendar';
import { HomeSection, NavBarGardenSection } from '@/components/new/navGardenSection/navbar';
import { useCalendar } from '@/hooks/useCalendar';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';


export default function Index() {

    const [currentSection, setCurrentSection] = useState<HomeSection>('calendar')
    const { calendar } = useCalendar()
    return (
        <View style={styles.container}>
            <NavBarGardenSection currentSectionProps={currentSection}
                setCurrentSectionProps={setCurrentSection} />
            {currentSection === 'calendar' &&
                <CalendarComp calendarProp={calendar} />
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
