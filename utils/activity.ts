import * as SecureStore from 'expo-secure-store';

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

        let creationDate = await SecureStore.getItemAsync(creationKey);
        if (!creationDate) {
            await SecureStore.setItemAsync(creationKey, todayStr);
        }

        const lastConn = await SecureStore.getItemAsync(lastConnKey);
        const streakStr = await SecureStore.getItemAsync(streakKey);
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

        await SecureStore.setItemAsync(lastConnKey, todayStr);
        await SecureStore.setItemAsync(streakKey, streak.toString());

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
        const streakStr = await SecureStore.getItemAsync(streakKey);
        const streak = streakStr ? parseInt(streakStr, 10) : 0;
        return isNaN(streak) ? 0 : streak;
    } catch (error) {
        console.error("Failed to get activity streak:", error);
        return 0;
    }
}
