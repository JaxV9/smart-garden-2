import { BackButton } from "@/components/new/backButton/backButton";
import { CalendarComp } from "@/components/new/calendar/calendar";
import { useCalendar } from "@/hooks/useCalendar";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";


export default function Calendar() {
    const { calendar } = useCalendar()

    return (
        <>
            <View style={styles.container}>
                <BackButton callback={() => router.replace('/home')} />
                <CalendarComp calendarProp={calendar} />
            </View>
        </>
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
});
