import * as SecureStore from 'expo-secure-store';

export function useStorage() {

    async function putToken(key: string, value: string): Promise<void> {
        if (typeof window === 'undefined') return;
        try {
            const isAvailable = await SecureStore.isAvailableAsync();
            if (isAvailable) {
                await SecureStore.setItemAsync(key, value);
                return;
            }
        } catch (e) {
            // SecureStore not available or failed
        }
        if (typeof window !== 'undefined' && window.localStorage) {
            window.localStorage.setItem(key, value);
        }
    }

    async function getToken(token: string): Promise<string | null> {
        if (typeof window === 'undefined') return null;
        try {
            const isAvailable = await SecureStore.isAvailableAsync();
            if (isAvailable) {
                return await SecureStore.getItemAsync(token);
            }
        } catch (e) {
            // SecureStore not available or failed
        }
        if (typeof window !== 'undefined' && window.localStorage) {
            return window.localStorage.getItem(token);
        }
        return null;
    }

    async function deleteToken(token: string): Promise<void> {
        if (typeof window === 'undefined') return;
        try {
            const isAvailable = await SecureStore.isAvailableAsync();
            if (isAvailable) {
                await SecureStore.deleteItemAsync(token);
                return;
            }
        } catch (e) {
            // SecureStore not available or failed
        }
        if (typeof window !== 'undefined' && window.localStorage) {
            window.localStorage.removeItem(token);
        }
    }

    return { putToken, getToken, deleteToken };
}
