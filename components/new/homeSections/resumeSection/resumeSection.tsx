import { useGardenContext } from '@/contexts/garden.context';
import { useTasks } from '@/hooks/useTasks';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';


export const ResumeSection = () => {
    const { gardenVegetables } = useGardenContext()
    const { tasks } = useTasks();

    const completedTasksCount = tasks.filter(task => task.completed).length;

    return (
        <>
            <View style={styles.container}>
                <View style={styles.squaresContainer}>
                    <View style={[styles.item, styles.plant]}>
                        <Text style={styles.numbers}>{gardenVegetables.length}</Text>
                        <Text style={styles.label}>Plantes cultivées</Text>
                    </View>
                    <View style={[styles.item, styles.task]}>
                        <Text style={styles.numbers}>{completedTasksCount}</Text>
                        <Text style={styles.label}>Tâches complétées</Text>
                    </View>
                    <View style={[styles.item, styles.activity]}>
                        <Text style={styles.numbers}>3</Text>
                        <Text style={styles.label}>Jours d'activité</Text>
                    </View>
                    <View style={[styles.item, styles.sensor]}>
                        <Text style={styles.numbers}>1</Text>
                        <Text style={styles.label}>Capteurs connectés</Text>
                    </View>
                </View>
                <Text style={styles.title}>Outils</Text>
                <View style={styles.squaresContainer}>
                    <Pressable onPress={() => router.replace('/taches')} style={styles.toolContainer}>
                        <View style={styles.row}>
                            <Image source={require('@/assets/icons/taskIcon.svg')}
                                style={styles.taskIcon} />
                            <Text style={styles.toolTitle}>Tâches</Text>
                        </View>
                        <Text>Planifier les tâches</Text>
                    </Pressable>
                    <Pressable onPress={() => router.replace('/calendar')} style={styles.toolContainer}>
                        <View style={styles.row}>
                            <Image source={require('@/assets/icons/calendarIcon.svg')}
                                style={styles.calendarIcon} />
                            <Text style={styles.toolTitle}>Calendrier</Text>
                        </View>
                        <Text>Calendrier d'entretien</Text>
                    </Pressable>
                    <Pressable onPress={() => router.replace('/capteurs')} style={styles.toolContainer}>
                        <View style={styles.row}>
                            <Image source={require('@/assets/icons/sensorIcon.svg')}
                                style={styles.sensorIcon} />
                            <Text style={styles.toolTitle}>Capteurs</Text>
                        </View>
                        <Text>Gérer les capteurs</Text>
                    </Pressable>
                    <Pressable onPress={() => router.replace('/plan')} style={styles.toolContainer}>
                        <View style={styles.row}>
                            <Image source={require('@/assets/icons/planIcon.svg')}
                                style={styles.planIcon} />
                            <Text style={styles.toolTitle}>Plan</Text>
                        </View>
                        <Text>Dessiner le plan</Text>
                    </Pressable>
                </View>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: 16
    },
    squaresContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    item: {
        width: '48%',
        padding: 16,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        gap: 8
    },
    numbers: {
        fontSize: 22,
        fontWeight: 600
    },
    plant: {
        backgroundColor: '#EBECD2'
    },
    task: {
        backgroundColor: '#D1EFE7'
    },
    activity: {
        backgroundColor: '#E7BDBB'
    },
    sensor: {
        backgroundColor: '#E7C2A0'
    },
    label: {
        fontSize: 14
    },
    title: {
        fontSize: 20,
    },
    toolContainer: {
        width: '48%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#ffff',
        borderRadius: 8,
        gap: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 1,
    },
    toolTitle: {
        fontWeight: 600,
        color: '#5B8E55'
    },
    row: {
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    taskIcon: {
        width: 17,
        height: 14
    },
    calendarIcon: {
        width: 14.7,
        height: 16.33
    },
    sensorIcon: {
        width: 24,
        height: 24
    },
    planIcon: {
        width: 19,
        height: 19
    }
});
