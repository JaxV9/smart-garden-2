import { StyleSheet, View } from 'react-native';
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
            <View style={styles.backButtonRow}>
                <BackButton callback={() => router.replace('/home')} />
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
        paddingBottom: 10,
    },
    backButtonRow: {
        paddingHorizontal: 20,
        marginBottom: 8,
    },
});