
import { Image } from "expo-image";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";


export default function StartingScreen() {



    return (
        <View style={styles.container}>
            <Image source={require('@/assets/icons/logoTypo.svg')} style={{ width: 176, height: 260 }} />
            <View style={styles.titleContainer}>
                <Text style={styles.titleOne}>Commençons à</Text>
                <Text style={styles.titleTwo}>Jardiner !</Text>
            </View>
            <View style={styles.btnContainers}>
                <Pressable style={styles.connectionBtn} onPress={() => router.replace('/login')}>
                    <Text style={styles.connectionLabel}>SE CONNECTER</Text>
                </Pressable>
                <Pressable style={styles.registerBtn} onPress={() => router.replace('/register')}>
                    <Text style={styles.registerLabel}>S'INSCRIRE</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: '30%',
        alignItems: 'center',
        backgroundColor: "#FFFDF0",
        gap: 64,
    },
    titleContainer: {
        gap: 8
    },
    titleOne: {
        textAlign: 'center',
        fontSize: 28
    },
    titleTwo: {
        textAlign: 'center',
        fontSize: 28,
        color: '#5B8E55',
        fontWeight: 800
    },
    btnContainers: {
        gap: 8,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    connectionBtn: {
        backgroundColor: '#5B8E55',
        width: '80%',
        paddingTop: 16,
        paddingBottom: 16,
        alignItems: 'center',
        borderRadius: 4
    },
    registerBtn: {
        borderBlockColor: '#5B8E55',
        borderWidth: 1,
        width: '80%',
        paddingTop: 16,
        paddingBottom: 16,
        alignItems: 'center',
        borderRadius: 4
    },
    connectionLabel: {
        color: '#ffff',
        fontWeight: 600,
        fontSize: 16
    },
    registerLabel: {
        color: '#5B8E55',
        fontWeight: 600,
        fontSize: 16
    }
});
