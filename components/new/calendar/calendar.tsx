import { useCalendar } from "@/hooks/useCalendar";
import { Calendar, Month } from "@/models/models";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";

interface CalendarProps {
    calendarProp: Calendar
}

export function CalendarComp({ calendarProp }: CalendarProps) {
    const { monthToFrench } = useCalendar()

    function formatText(text: Month) {
        const frenchMonth = monthToFrench(text);
        return frenchMonth.charAt(0).toUpperCase() + frenchMonth.slice(1)
    }

    return (
        <>
            <ScrollView style={styles.scrollContainer}>
                <View style={styles.container}>
                    {calendarProp.map((month, index) => (
                        <View key={index} style={styles.monthContainer}>
                            <Text style={styles.monthText}>{formatText(month.month)}</Text>
                            {month.vegetables.length === 0 &&
                                <Text style={styles.subInfo}>Aucune activité</Text>
                            }
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
    monthContainer: {
        width: cardWidth,
        height: 'auto',
        padding: 12,
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
    },
    monthText: {
        fontSize: 16,
        fontWeight: 500,
        marginBottom: 16
    },
    subInfo: {
        color: '#99A1AF'
    }
});
