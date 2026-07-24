import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const getItemSafe = async (key: string): Promise<string | null> => {
    if (typeof window === 'undefined') return null;
    if (Platform.OS === 'web') {
        return localStorage.getItem(key);
    }
    return await SecureStore.getItemAsync(key);
};

const setItemSafe = async (key: string, value: string): Promise<void> => {
    if (typeof window === 'undefined') return;
    if (Platform.OS === 'web') {
        localStorage.setItem(key, value);
        return;
    }
    await SecureStore.setItemAsync(key, value);
};

/**
 * Updates and retrieves the consecutive connection days (streak) for a user.
 * 
 * @param userId Unique identifier of the user
 * @returns The current consecutive connection days (streak)
 */
export async function updateActivityStreak(userId: string): Promise<number> {
    try {
        const todayStr = new Date().toISOString().split('T')[0];

        const creationKey = `creation_date_${userId}`;
        const lastConnKey = `last_connection_${userId}`;
        const streakKey = `activity_streak_${userId}`;

        let creationDate = await getItemSafe(creationKey);
        if (!creationDate) {
            await setItemSafe(creationKey, todayStr);
        }

        const lastConn = await getItemSafe(lastConnKey);
        const streakStr = await getItemSafe(streakKey);
        let streak = streakStr ? parseInt(streakStr, 10) : 0;
        if (isNaN(streak) || streak < 0) {
            streak = 0;
        }

        if (!lastConn) {
            streak = 1;
        } else if (lastConn === todayStr) {
            if (streak === 0) streak = 1;
        } else {
            const lastDate = new Date(lastConn + "T00:00:00");
            const todayDate = new Date(todayStr + "T00:00:00");

            const diffTime = todayDate.getTime() - lastDate.getTime();
            const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                streak += 1;
            } else if (diffDays > 1) {
                streak = 1;
            } else if (diffDays < 0) {
                if (streak === 0) streak = 1;
            }
        }

        await setItemSafe(lastConnKey, todayStr);
        await setItemSafe(streakKey, streak.toString());

        return streak;
    } catch (error) {
        console.error("Failed to update activity streak:", error);
        return 0;
    }
}

/**
 * Gets the current activity streak for a user without updating it.
 */
export async function getActivityStreak(userId: string): Promise<number> {
    try {
        const streakKey = `activity_streak_${userId}`;
        const streakStr = await getItemSafe(streakKey);
        const streak = streakStr ? parseInt(streakStr, 10) : 0;
        return isNaN(streak) ? 0 : streak;
    } catch (error) {
        console.error("Failed to get activity streak:", error);
        return 0;
    }
}
