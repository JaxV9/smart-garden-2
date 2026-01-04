import { Calendar, Month, VegetableMonth } from "@/models/models";
import { useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { CalendarModal } from "./calendarModal/calendarModal";
import { CalendarMonthCard } from "./calendarMonthCard/calendarMonthCard";
import { CalendarVegetable } from "./calendarVegetable/calendarVegetable";

interface CalendarProps {
    calendarProp: Calendar
}

export function CalendarComp({ calendarProp }: CalendarProps) {
    const [monthModal, setMonthModal] = useState<{
        month: Month
        vegetables: VegetableMonth[]
    }>();

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={styles.scrollContainer}>
                <View style={styles.container}>
                    {calendarProp.map((month, index) => (
                        <CalendarMonthCard key={index} callback={() => setMonthModal({ month: month.month, vegetables: month.vegetables })}
                            month={month.month} cardWidth={cardWidth}>
                            {
                                month.vegetables.slice(0, 3).map((vegetable, index) => (
                                    <CalendarVegetable key={index} vegetable={vegetable.vegetable}
                                        type={vegetable.type} />
                                ))
                            }
                            {month.vegetables.length > 3 &&
                                <Text style={styles.subInfo}>
                                    + {month.vegetables.length - 3}
                                </Text>
                            }
                            {month.vegetables.length === 0 &&
                                <Text style={styles.subInfo}>Aucune activité</Text>
                            }
                        </CalendarMonthCard>
                    ))}
                </View>

            </ScrollView>
            {monthModal &&
                <CalendarModal vegetables={monthModal.vegetables} month={monthModal.month}
                    callback={() => setMonthModal(undefined)} />
            }
        </View>
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
    subInfo: {
        color: '#99A1AF'
    },
});
