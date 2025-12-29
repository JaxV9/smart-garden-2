import { useCalendar } from "@/hooks/useCalendar";
import { Month } from "@/models/models";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface CalendarMonthCardProps {
    month: Month,
    callback?: () => void,
    children: React.ReactNode,
    cardWidth: number
}

export function CalendarMonthCard({ month, callback, children, cardWidth }: CalendarMonthCardProps) {
    const { monthToFrench } = useCalendar()

    function formatText(text: Month) {
        return monthToFrench(text)
    }

    return (
        <Pressable style={[styles.monthContainer, { 'width': cardWidth }]} onPress={callback ? () => callback() : () => undefined}>
            <Text style={styles.monthText}>{formatText(month)}</Text>
            <View style={styles.gap8}>
                {children}
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
    },
    monthContainer: {
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
    },
    gap8: {
        gap: 8,
    }
});
