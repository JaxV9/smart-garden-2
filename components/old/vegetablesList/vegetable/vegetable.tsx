import { Vegetable } from '@/models/models';
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';

type VegetableProps = {
    vegetable: Vegetable,
    callBack: () => unknown
}

export const VegetableCard = ({ vegetable, callBack }: VegetableProps) => {

    return (
        <TouchableOpacity onPress={(callBack)} style={styles.vegetable}>
            <Image source={{ uri: vegetable.images[0] }}
                style={styles.vegetableImage} />
            <Text style={styles.vegetableText}>{vegetable.name}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    vegetable: {
        width: '48%',
        height: '48%',
        aspectRatio: 1,
        display: 'flex'
    },
    vegetableImage: {
        width: '100%',
        height: '95%',
        borderRadius: 8,
        margin: 'auto'
    },
    vegetableText: {
        fontWeight: 500
    }
});
