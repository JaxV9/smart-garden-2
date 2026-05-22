import { StyleSheet, Text, View } from 'react-native';
import { Task } from '@/components/new/task/task';
import { router } from 'expo-router';
import { BackButton } from '@/components/new/backButton/backButton';
import { Header } from '@/components/new/header/header';

export default function Index() {
    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Header />
            </View>
            <View style={styles.navRow}>
                <View style={styles.backButtonContainer}>
                    <BackButton callback={() => router.replace('/home')} />
                </View>
                <Text style={styles.pageTitle}>Tâches</Text>
            </View>
            <Task />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 64,
        backgroundColor: '#F9FAFB'
    },
    headerContainer: {
        paddingHorizontal: 20,
        marginBottom: 4,
    },
    navRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        paddingHorizontal: 20,
        height: 40,
        marginBottom: 8,
    },
    backButtonContainer: {
        position: 'absolute',
        left: 20,
        zIndex: 10,
    },
    pageTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: '#111827',
    }
});