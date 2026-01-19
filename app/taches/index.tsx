import { StyleSheet, View } from 'react-native';
import { Task } from '@/components/new/task/task';
import { router } from 'expo-router';
import { BackButton } from '@/components/new/backButton/backButton';

export default function Index() {

    return (
            <View style={styles.container}>
                <BackButton callback={() => router.replace('/home')} />
                <Task />
            </View>
        );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 64,
        paddingLeft: 8,
        paddingRight: 8,
        gap: 16,
        backgroundColor: '#F9FAFB'
    }
});