import { Month, VegetableMonth } from "@/models/models";
import { BlurView } from "expo-blur";
import { StyleSheet, Text, View } from "react-native";
import { BackButton } from "../../backButton/backButton";
import { CalendarMonthCard } from "../calendarMonthCard/calendarMonthCard";
import { CalendarVegetable } from "../calendarVegetable/calendarVegetable";

interface CalendarModalProps {
    month: Month
    vegetables: VegetableMonth[],
    callback: () => void
}

export function CalendarModal({ month, vegetables, callback }: CalendarModalProps) {

    return (
        <BlurView intensity={12} style={styles.container}>
            <View style={styles.contentContainer}>
                <BackButton callback={callback} />
                <CalendarMonthCard month={month} cardWidth={300}>
                    {
                        vegetables.map((vegetable, index) => (
                            <CalendarVegetable key={index} vegetable={vegetable.vegetable}
                                type={vegetable.type} />
                        ))
                    }
                    {vegetables.length === 0 &&
                        <Text style={styles.subInfo}>Aucune activité</Text>
                    }
                </CalendarMonthCard>
            </View>
        </BlurView>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        alignItems: 'center',
    },
    contentContainer: {
        marginTop: 64,
        gap: 16
    },
    modal: {
        width: '80%',
        height: 'auto',
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
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
    subInfo: {
        color: '#99A1AF'
    },
});
