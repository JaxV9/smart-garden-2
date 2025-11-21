import { Vegetable } from '@/models/models';
import { router } from 'expo-router';
import { ReactNode } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Text } from 'react-native';

type VegetablesGardenListPropsType = {
    children: ReactNode
}

export const VegetablesGardenList = ({ children }: VegetablesGardenListPropsType) => {


    return (
        <>
            <View style={styles.container}>
                {children}
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: 16
    },
});
