import { Image, ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type VegetableCardGardenPropsType = {
    label: string,
    subLabel?: string,
    image: ImageSourcePropType,
    callback: () => void
    onLongPressCallback: () => void,
}

export const VegetableCardGarden = ({ label, subLabel, image, callback, onLongPressCallback }: VegetableCardGardenPropsType) => {

    return (
        <>
            <TouchableOpacity style={styles.container}
                onPress={() => callback()}
                onLongPress={() => onLongPressCallback()}>
                <Image source={image} style={styles.image} />
                <View style={styles.vegetableDescriptionContainer}>
                    <View style={styles.labelsContainer}>
                        <Text style={styles.label}>{label}</Text>
                        {subLabel && (
                            <View style={styles.subLabelContainer}>
                                <Image source={require('@/assets/icons/gardenIcon.svg')} />
                                <Text style={styles.sublabel}>{subLabel}</Text>
                            </View>
                        )}
                    </View>
                    <Image source={require('@/assets/icons/arrow-menu.svg')} />

                </View>
            </TouchableOpacity>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: 150,
        backgroundColor: '#EBECD2',
        borderRadius: 16,
        display: 'flex',
        flexDirection: 'row'
    },
    image: {
        width: 134,
        height: 134,
        aspectRatio: 1,
        borderRadius: 16,
        marginTop: 'auto',
        marginBottom: 'auto',
        marginLeft: 8
    },
    vegetableDescriptionContainer: {
        width: '50%',
        margin: 'auto',
        display: 'flex',
        flexDirection: 'row'
    },
    labelsContainer: {
        width: '100%',
        marginTop: 'auto',
        marginBottom: 'auto',
    },
    label: {
        fontSize: 20,
        color: '#60655D'
    },
    sublabel: {
        fontSize: 16,
        color: '#60655D',
        fontWeight: 300
    },
    arrowMenu: {
        margin: 'auto',
        marginRight: 8,
        width: 50,
        height: 50,
        transform: [{ scale: 1.2 }]
    },
    subLabelContainer: {
        display: 'flex',
        flexDirection: 'row',
        gap: 8
    }
});
