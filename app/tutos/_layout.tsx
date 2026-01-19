import { TutorialsProvider } from '@/contexts/tutorials.context';
import { Stack } from 'expo-router';

export default function TutosLayout() {
    return (
        <TutorialsProvider>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="[id]" />
            </Stack>
        </TutorialsProvider>
    );
}
