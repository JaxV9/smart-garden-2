import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

type VegetablesListProps = {
    children: ReactNode
}

export const VegetablesList = ({ children }: VegetablesListProps) => {

    return (
        <View style={styles.vegetablesContainer}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    vegetablesContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        paddingBottom: 8,
    },
});
