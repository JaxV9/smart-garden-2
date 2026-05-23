import { Task } from '@/components/new/task/task';
import AppHeader from '@/components/new/ui/AppHeader';
import { StyleSheet, View } from 'react-native';

export default function Index() {
    return (
        <View style={styles.container}>
            <AppHeader
                title="Tâches"
                showBack={true}
                fallbackRoute="/home"
            />
            <Task />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
});