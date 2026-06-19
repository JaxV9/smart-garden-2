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
                <View style={styles.legendContainer}>
                    <View style={[styles.legendTag, styles.isSowing]}>
                        <Text style={styles.isTextSowing}>Semis</Text>
                    </View>
                    <View style={[styles.legendTag, styles.isPlantation]}>
                        <Text style={styles.isTextPlantation}>Plantation</Text>
                    </View>
                    <View style={[styles.legendTag, styles.isHarvest]}>
                        <Text style={styles.isTextHarvest}>Récolte</Text>
                    </View>
                </View>
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
        justifyContent: 'center'
    },
    subInfo: {
        color: '#99A1AF'
    },
    title: {
        fontSize: 28,
        marginLeft: 8
    },
    legendContainer: {
        margin: 8,
        padding: 8,
        gap: 8,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    legendTag: {
        paddingTop: 4,
        paddingBottom: 4,
        paddingLeft: 8,
        paddingRight: 8,
        borderRadius: 8
    },
    isSowing: {
        backgroundColor: '#FEF9C2',
        borderColor: '#FFDF20',
    },
    isTextSowing: {
        color: '#894B00',
        marginTop: 'auto',
        marginBottom: 'auto',
        fontWeight: 500
    },
    isHarvest: {
        backgroundColor: '#FFEDD4',
        borderColor: '#FFB86A',
        color: '#9F2D00',
    },
    isTextHarvest: {
        color: '#894B00',
        marginTop: 'auto',
        marginBottom: 'auto',
        fontWeight: 500
    },
    isPlantation: {
        backgroundColor: '#DCFCE7',
        borderColor: '#7BF1A8',
        color: '#016630'
    },
    isTextPlantation: {
        color: '#894B00',
        marginTop: 'auto',
        marginBottom: 'auto',
        fontWeight: 500
    },
});
