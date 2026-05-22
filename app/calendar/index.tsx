import { BackButton } from "@/components/new/backButton/backButton";
import { CalendarComp } from "@/components/new/calendar/calendar";
import { Header } from "@/components/new/header/header";
import { useCalendar } from "@/hooks/useCalendar";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function Calendar() {
    const { calendar } = useCalendar();

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Header />
            </View>
            <View style={styles.backButtonRow}>
                <BackButton callback={() => router.replace('/home')} />
            </View>
            <CalendarComp calendarProp={calendar} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 64,
        backgroundColor: '#F9FAFB'
    },
    headerContainer: {
        paddingHorizontal: 20,
        paddingBottom: 10,
    },
    backButtonRow: {
        paddingHorizontal: 20,
        marginBottom: 8,
    },
});
