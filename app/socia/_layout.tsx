import { SocialProvider } from '@/contexts/social.context';
import { Stack } from 'expo-router';

export default function SocialLayout() {
    return (
        <SocialProvider>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
            </Stack>
        </SocialProvider>
    );
}
