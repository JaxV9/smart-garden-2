import * as SecureStore from 'expo-secure-store';


export function useStorage() {

    async function putToken(key: string, value: string): Promise<void> {
        await SecureStore.setItemAsync(key, value);
    };

    async function getToken(token: string): Promise<string | null> {
        const item = await SecureStore.getItemAsync(token);
        return item;
    };

    async function deleteToken(token: string) {
        await SecureStore.deleteItemAsync(token);
    };



    return { putToken, getToken, deleteToken };
}
