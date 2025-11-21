import { Image } from 'expo-image';
import { StyleSheet, Text, View, } from 'react-native';

type SensorPropsType = {
    name: string,
    measures: {
        temperature: string,
        luminosity: string
        humidity: string,
    }
}

export const SensorCard = ({ name, measures }: SensorPropsType) => {

    return (
        <>
            <View style={styles.container}>
                <Text style={styles.sensorName}>{name}</Text>
                <View style={styles.measuresContainer}>
                    <View style={styles.measure}>
                        <Image source={require('@/assets/icons/heatingIcon.svg')} style={styles.icon} />
                        <Text style={styles.measureLabel}>
                            {measures.temperature}
                        </Text>
                    </View>
                    <View style={styles.measure}>
                        <Image source={require('@/assets/icons/luminosityIcon.svg')} style={styles.icon} />
                        <Text style={styles.measureLabel}>
                            {measures.luminosity}
                        </Text>
                    </View>
                    <View style={styles.measure}>
                        <Image source={require('@/assets/icons/humidityIcon.svg')} style={styles.icon} />
                        <Text style={styles.measureLabel}>
                            {measures.humidity}
                        </Text>
                    </View>
                </View>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 'auto',
        backgroundColor: '#D1EFE7',
        borderRadius: 16,
        padding: 8,
        gap: 16
    },
    sensorName: {
        fontSize: 16
    },
    measuresContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between', // pour espacer également les enfants
        gap: 16
    },
    measure: {
        flex: 1,
        height: 64,
        borderRadius: 16,
        backgroundColor: 'white',
        padding: 8,
        display: 'flex',
        flexDirection: 'row',
        gap: 8
    },
    icon: {
        marginTop: 'auto',
        marginBottom: 'auto',
    },
    measureLabel: {
        marginTop: 'auto',
        marginBottom: 'auto',
        fontSize: 22,
        fontWeight: 400
    }
});
