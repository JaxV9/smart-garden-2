import { BackButton } from "@/components/new/backButton/backButton";
import { CalendarComp } from "@/components/new/calendar/calendar";
import { useCalendar } from "@/hooks/useCalendar";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Header } from "@/components/new/header/header";

export default function Calendar() {
    const { calendar } = useCalendar()

    return (
        <View style={styles.container}>
            <Header/>

            <View style={styles.actionsRow}>
                <BackButton callback={() => router.replace("/home")} />
            </View>

            <CalendarComp calendarProp={calendar} />
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  actionsRow: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
});
