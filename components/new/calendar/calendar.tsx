import { Calendar, Month, Vegetable, VegetableMonth } from "@/models/models";
import { useMemo, useState } from "react";
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { CalendarModal } from "./calendarModal/calendarModal";
import { CalendarMonthCard } from "./calendarMonthCard/calendarMonthCard";
import { CalendarVegetable } from "./calendarVegetable/calendarVegetable";
import { CalendarVegetableCard, VegetableMonthEntry } from "./calendarVegetableCard/calendarVegetableCard";
import { useTranslation } from "@/contexts/language.context";

interface CalendarProps {
    calendarProp: Calendar
}

export function CalendarComp({ calendarProp }: CalendarProps) {
    const { t } = useTranslation();
    const [monthModal, setMonthModal] = useState<{
        month: Month
        vegetables: VegetableMonth[]
    }>();

    const [mode, setMode] = useState<'month' | 'vegetable'>('vegetable');
    const [search, setSearch] = useState('');

    function changeMode(mode: 'month' | 'vegetable') {
        setMode(mode);
    }

    const vegetableMap = useMemo(() => {
        const map = new Map<string, { vegetable: Vegetable; entries: VegetableMonthEntry[] }>();
        const MONTH_INDEX: Record<string, number> = {
            January: 0, February: 1, March: 2, April: 3,
            May: 4, June: 5, July: 6, August: 7,
            September: 8, October: 9, November: 10, December: 11,
        };
        calendarProp.forEach(({ month, vegetables }) => {
            const monthIdx = MONTH_INDEX[month];
            vegetables.forEach(({ vegetable, type }) => {
                if (!map.has(vegetable.id)) {
                    map.set(vegetable.id, { vegetable, entries: [] });
                }
                map.get(vegetable.id)!.entries.push({ monthIndex: monthIdx, type });
            });
        });
        return Array.from(map.values());
    }, [calendarProp]);

    const filteredVegetables = useMemo(() => {
        if (!search.trim()) return vegetableMap;
        const q = search.toLowerCase();
        return vegetableMap.filter(v => {
            const rawName = v.vegetable.name.toLowerCase();
            const localizedName = t('veg_name_' + v.vegetable.id, v.vegetable.name).toLowerCase();
            return rawName.includes(q) || localizedName.includes(q);
        });
    }, [vegetableMap, search, t]);

    return (
        <View style={{ flex: 1, paddingTop: 28 }}>
            <ScrollView style={styles.scrollContainer}>
                <View style={styles.switchContainer}>
                    <Pressable onPress={() => changeMode('month')} style={mode === 'month' ? styles.switchBtnActive : styles.switchBtnInactive}>
                        <Text>{t('cal_by_month', 'Par mois')}</Text>
                    </Pressable>
                    <Pressable onPress={() => changeMode('vegetable')} style={mode === 'vegetable' ? styles.switchBtnActive : styles.switchBtnInactive}>
                        <Text>{t('cal_by_plant', 'Par plantes')}</Text>
                    </Pressable>
                </View>
                {mode === 'vegetable' &&
                    <View style={styles.vegetableContainer}>
                        <View style={styles.searchBar}>
                            <Text style={styles.searchIcon}>🔍</Text>
                            <TextInput
                                style={styles.searchInput}
                                placeholder={t('cal_search_placeholder', 'Rechercher')}
                                placeholderTextColor="#9ca3af"
                                value={search}
                                onChangeText={setSearch}
                            />
                        </View>
                        {filteredVegetables.map((item, index) => (
                            <CalendarVegetableCard
                                key={item.vegetable.id ?? index}
                                vegetable={item.vegetable}
                                entries={item.entries}
                            />
                        ))}
                        {filteredVegetables.length === 0 &&
                            <Text style={styles.subInfo}>{t('cal_no_vegetable', 'Aucun légume trouvé')}</Text>
                        }
                    </View>
                }
                {mode === 'month' &&
                    <>
                        <View style={styles.legendContainer}>
                            <View style={[styles.legendTag, styles.isSowing]}>
                                <Text style={styles.isTextSowing}>{t('cal_sowing', 'Semis')}</Text>
                            </View>
                            <View style={[styles.legendTag, styles.isPlantation]}>
                                <Text style={styles.isTextPlantation}>{t('cal_planting', 'Plantation')}</Text>
                            </View>
                            <View style={[styles.legendTag, styles.isHarvest]}>
                                <Text style={styles.isTextHarvest}>{t('cal_harvest', 'Récolte')}</Text>
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
                                        <Text style={styles.subInfo}>{t('cal_no_activity', 'Aucune activité')}</Text>
                                    }
                                </CalendarMonthCard>
                            ))}
                        </View>
                    </>
                }
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
    switchContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: gap,
        padding: containerPadding,
        backgroundColor: '#eeeeeeff',
        width: 200,
        borderRadius: 16,
        justifyContent: 'space-around',
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    switchBtnInactive: {
        borderRadius: 8,
        paddingLeft: 8,
        paddingRight: 8,
        paddingTop: 4,
        paddingBottom: 4
    },
    switchBtnActive: {
        backgroundColor: 'white',
        borderRadius: 8,
        paddingLeft: 8,
        paddingRight: 8,
        paddingTop: 4,
        paddingBottom: 4
    },
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: gap,
        padding: containerPadding,
        justifyContent: 'center',
        paddingBottom: 42
    },
    vegetableContainer: {
        flexDirection: 'column',
        padding: containerPadding,
        paddingBottom: 42
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#86efac',
        marginHorizontal: 8,
        marginTop: 8,
        marginBottom: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        gap: 8,
    },
    searchIcon: {
        fontSize: 15,
        color: '#6b7280',
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: '#1a1a1a',
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
