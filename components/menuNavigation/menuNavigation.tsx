import { Image } from 'expo-image';
import { ReactNode } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';


type MenuNavigationPropsType = {
    label: string,
    callback: () => void,
    children: ReactNode
}

export const MenuNavigation = ({ label, callback, children }: MenuNavigationPropsType) => {


    return (
        <TouchableOpacity style={styles.menuBtn} onPress={() => callback()}>
            {children}
            <Text style={styles.menuLabel}>{label}</Text>
            <Image source={require('@/assets/icons/arrow-menu.svg')} style={styles.arrowMenu} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    menuBtn: {
        display: 'flex',
        flexDirection: 'row',
        width: '90%',
        gap: 28
    },
    menuLabel: {
        marginTop: 'auto',
        marginBottom: 'auto',
        fontWeight: 500,
        fontSize: 16
    },
    arrowMenu: {
        marginTop: 'auto',
        marginBottom: 'auto',
        marginLeft: 'auto',
        marginRight: 8,
    }
});
