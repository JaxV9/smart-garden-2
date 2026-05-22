
import { CalendarComp } from "@/components/new/calendar/calendar";
import AppHeader from "@/components/new/ui/AppHeader";
import { useCalendar } from "@/hooks/useCalendar";
import { StyleSheet, View } from "react-native";

export default function Calendar() {
    const { calendar } = useCalendar();

    return (
        <View style={styles.container}>
            <AppHeader
                title="Calendrier"
                showBack={true}
                showNotifications={true}
                fallbackRoute="/home"
            />

            <CalendarComp calendarProp={calendar} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
});