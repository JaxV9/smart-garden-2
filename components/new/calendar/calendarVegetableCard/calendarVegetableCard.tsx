import { Vegetable, VegetablePlannification } from "@/models/models";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

const MONTHS_SHORT = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

const MONTH_INDEX: Record<string, number> = {
    January: 0, February: 1, March: 2, April: 3,
    May: 4, June: 5, July: 6, August: 7,
    September: 8, October: 9, November: 10, December: 11,
};

export type VegetableMonthEntry = {
    monthIndex: number;
    type: VegetablePlannification;
};

interface CalendarVegetableCardProps {
    vegetable: Vegetable;
    entries: VegetableMonthEntry[];
}

type BarSegment = {
    startIndex: number;
    endIndex: number;
    type: VegetablePlannification;
};

function getBarSegments(entries: VegetableMonthEntry[], type: VegetablePlannification): BarSegment[] {
    const months = entries
        .filter(e => e.type === type)
        .map(e => e.monthIndex)
        .sort((a, b) => a - b);

    if (months.length === 0) return [];

    const segments: BarSegment[] = [];
    let start = months[0];
    let end = months[0];

    for (let i = 1; i < months.length; i++) {
        if (months[i] === end + 1) {
            end = months[i];
        } else {
            segments.push({ startIndex: start, endIndex: end, type });
            start = months[i];
            end = months[i];
        }
    }
    segments.push({ startIndex: start, endIndex: end, type });
    return segments;
}

function getBarStyle(type: VegetablePlannification) {
    switch (type) {
        case 'sowing': return { bar: styles.barSowing, label: styles.labelSowing, text: styles.textSowing };
        case 'plantation': return { bar: styles.barPlantation, label: styles.labelPlantation, text: styles.textPlantation };
        case 'harvest': return { bar: styles.barHarvest, label: styles.labelHarvest, text: styles.textHarvest };
    }
}

function getBarLabel(type: VegetablePlannification) {
    switch (type) {
        case 'sowing': return 'Semis';
        case 'plantation': return 'Plantation';
        case 'harvest': return 'Récolte';
    }
}

export function CalendarVegetableCard({ vegetable, entries }: CalendarVegetableCardProps) {
    const types: VegetablePlannification[] = ['sowing', 'plantation', 'harvest'];

    const TOTAL_CELLS = 12;

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <View style={styles.iconWrapper}>
                    <Image
                        source={{ uri: vegetable.icons[0] }}
                        style={styles.icon}
                        contentFit="contain"
                    />
                </View>
                <Text style={styles.name}>{vegetable.name}</Text>
            </View>

            <View style={styles.timelineWrapper}>
                <View style={styles.monthRow}>
                    {MONTHS_SHORT.map((m, i) => (
                        <View key={i} style={styles.monthCell}>
                            <Text style={styles.monthLabel}>{m}</Text>
                        </View>
                    ))}
                </View>

                {types.map(type => {
                    const segments = getBarSegments(entries, type);
                    if (segments.length === 0) return null;
                    const styleSet = getBarStyle(type);
                    return (
                        <View key={type} style={styles.barsRow}>
                            {segments.map((seg, i) => {
                                const spanCount = seg.endIndex - seg.startIndex + 1;
                                return (
                                    <View
                                        key={i}
                                        style={[
                                            styles.bar,
                                            styleSet.bar,
                                            {
                                                left: `${(seg.startIndex / TOTAL_CELLS) * 100}%` as any,
                                                width: `${(spanCount / TOTAL_CELLS) * 100}%` as any,
                                            },
                                        ]}
                                    >
                                        <Text style={[styles.barText, styleSet.text]} numberOfLines={1}>
                                            {getBarLabel(type)}
                                        </Text>
                                    </View>
                                );
                            })}
                        </View>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 14,
        marginHorizontal: 8,
        marginVertical: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.07,
        shadowRadius: 6,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 12,
    },
    iconWrapper: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#FFF0F0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        width: 28,
        height: 28,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a1a1a',
    },
    timelineWrapper: {
        position: 'relative',
    },
    monthRow: {
        flexDirection: 'row',
    },
    monthCell: {
        flex: 1,
        alignItems: 'center',
    },
    monthLabel: {
        fontSize: 11,
        color: '#212122ff',
        fontWeight: 'bold',
        marginBottom: 6,
    },
    barsRow: {
        position: 'relative',
        height: 30,
        marginTop: 4,
    },
    bar: {
        position: 'absolute',
        top: 0,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
    },
    barText: {
        fontSize: 11,
        fontWeight: '600',
    },
    barSowing: {
        backgroundColor: '#FEF9C2',
    },
    labelSowing: {},
    textSowing: {
        color: '#894B00',
    },
    barPlantation: {
        backgroundColor: '#DCFCE7',
    },
    labelPlantation: {},
    textPlantation: {
        color: '#894B00',
    },
    barHarvest: {
        backgroundColor: '#FFEDD4',
    },
    labelHarvest: {},
    textHarvest: {
        color: '#894B00',
    },
});
