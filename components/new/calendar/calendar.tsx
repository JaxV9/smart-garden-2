import { useCalendar } from "@/hooks/useCalendar";
import { Calendar } from "@/models/models";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";

interface CalendarProps {
    calendarProp: Calendar
}

export function CalendarComp({ calendarProp }: CalendarProps) {
    const { monthToFrench } = useCalendar()

    return (
        <>
            <ScrollView style={styles.scrollContainer}>
                <View style={styles.container}>
                    {calendarProp.map((month, index) => (
                        <View key={index} style={styles.month}>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </>
    )
}

const screenWidth = Dimensions.get('window').width;
const gap = 16;
const parentPadding = 8;
const containerPadding = 8;
const totalHorizontalPadding = (parentPadding * 2) + (containerPadding * 2);
const cardWidth = (screenWidth - totalHorizontalPadding - gap) / 2;

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
    },
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: gap,
        padding: containerPadding,
    },
    month: {
        width: cardWidth,
        height: 120,
        backgroundColor: '#FFF',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#00000018',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    }
});
