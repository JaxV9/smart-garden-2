import { Vegetable, VegetablePlannification } from "@/models/models";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "@/contexts/language.context";

interface CalendarVegetableProps {
    vegetable: Vegetable,
    type: VegetablePlannification
}

export function CalendarVegetable({ vegetable, type }: CalendarVegetableProps) {
    const { t } = useTranslation();

    function getStyleContainerType() {
        switch (type) {
            case 'sowing':
                return styles.isSowing
            case 'harvest':
                return styles.isHarvest
            case 'plantation':
                return styles.isPlantation
        }
    }

    function getStyleTextType() {
        switch (type) {
            case 'sowing':
                return styles.isTextSowing
            case 'harvest':
                return styles.isTextHarvest
            case 'plantation':
                return styles.isPlantation
        }
    }

    function getIconType() {
        switch (type) {
            case 'sowing':
                return require('@/assets/icons/sowingIcon.svg')
            case 'harvest':
                return require('@/assets/icons/harvestIcon.svg')
            case 'plantation':
                return require('@/assets/icons/plantationIcon.svg')
        }
    }

    return (
        <View style={[styles.container, getStyleContainerType()]}>
            <Image
                source={getIconType()}
                style={{ width: 16, height: 16 }}
            />
            <Text style={getStyleTextType()}>{t('veg_name_' + vegetable.id, vegetable.name)}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        padding: 8,
        borderRadius: 8,
        flexDirection: 'row',
        gap: 8,
        overflow: 'hidden'
    },
    isSowing: {
        backgroundColor: '#FEF9C2',
        borderColor: '#FFDF20',
    },
    isTextSowing: {
        color: '#894B00',
        marginTop: 'auto',
        marginBottom: 'auto',
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
    },
});
