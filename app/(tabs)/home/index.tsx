import { Header } from '@/components/header/header';
import { SensorCard } from '@/components/sensor/sensorCard';
import { VegetableCardGarden } from '@/components/vegetableCardGarden/vegetableCardGarden';
import { useGardenContext } from '@/contexts/garden.context';
import { useUserContext } from '@/contexts/user.context';
import { useVegetablesContext } from '@/contexts/vegetables.context';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Index() {
    const { loadVegetables } = useVegetablesContext()
    const { gardenVegetables, loadGardenVegetables } = useGardenContext()
    const { user } = useUserContext()

    useEffect(() => {
        loadVegetables()
    }, [])


    const fakeMeasures = [
        {
            temperature: '25°',
            luminosity: '71%',
            humidity: '50%',
        },
        {
            temperature: '32°',
            luminosity: '75%',
            humidity: '40%',
        }
    ]

    useEffect(() => {
        loadVegetables()
        loadGardenVegetables()
    }, [])

    return (
        <View style={styles.container}>
            <Header title={`Bonjour ${user?.name}`} />
            <VegetableCardGarden
                label="Mon potager" image={require('@/assets/images/garden.jpg')}
                subLabel={`${gardenVegetables.length.toString()} plantes`}
                onLongPressCallback={() => undefined}
                callback={() => router.push('/garden')}
            />
            <Text style={styles.subtitle}>Tableau de bord</Text>
            <SensorCard name='Capteur 1' measures={fakeMeasures[0]} />
            <SensorCard name='Capteur 2' measures={fakeMeasures[1]} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        paddingTop: "15%",
        gap: 16,
        backgroundColor: "#FFFDF0",
        paddingLeft: 16,
        paddingRight: 16,
    },
    subtitle: {
        fontSize: 18,
        textAlign: 'left',
        width: '100%'
    }
});
