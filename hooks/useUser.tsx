import { useUserContext } from "@/contexts/user.context";
import { CreateUserPayload, LoginInfos, LoginUserPayload, User } from "@/models/models";
import { Success } from "@jaslay/http";
import { router } from "expo-router";
import { useFetch } from "./useFetch";
import { useStorage } from "./useStorage";
import { updateActivityStreak } from "@/utils/activity";



export function useUser() {
    const { setUser, isLogin, setIsLogin, setActivityStreak } = useUserContext()
    const { httpClient } = useFetch(undefined)
    const { putToken, getToken, deleteToken } = useStorage()

    async function getUser(): Promise<"Success" | "Failure"> {
        try {
            const http = await httpClient
            const response = await http.get('/api/user');
            if (response.status !== 'Failure') {
                const data = response.payload as User
                const userInfos: User = {
                    id: data.id,
                    name: data.name,
                    publicName: data.publicName,
                    email: data.email,
                    level: data.level,
                    isPrivate: data.isPrivate
                };
                setUser(userInfos)
                setIsLogin(true)
                if (data.id) {
                    updateActivityStreak(data.id).then(streak => setActivityStreak(streak));
                }
            }
            return response.status
        } catch (error) {
            return "Failure";
        }
    }

    async function login(payload: LoginUserPayload): Promise<"Success" | "Failure"> {
        try {
            const http = await httpClient
            const response = await http.post('/api/login', payload);
            if (response.status !== 'Failure') {
                const data = response.payload as LoginInfos
                const isTokenAlreadyExists = await getToken('authToken');
                console.log("Existing token:", isTokenAlreadyExists);
                if (isTokenAlreadyExists !== null) {
                    await deleteToken('authToken');
                }
                await putToken('authToken', data.token);
                setIsLogin(true)
                const userInfos: User = {
                    id: data.userId,
                    name: data.userName,
                    publicName: data.publicName || data.userName,
                    email: data.email,
                    avatarUri: null,
                    level: data.level,
                    isPrivate: data.isPrivate
                };
                setUser(userInfos)
                if (data.userId) {
                    updateActivityStreak(data.userId).then(streak => setActivityStreak(streak));
                }
            }
            return response.status
        } catch (error) {
            console.error("Login failed:", error);
            return "Failure";
        }
    }

    async function createUser(payload: CreateUserPayload): Promise<"Success" | "Failure"> {
        try {
            const http = await httpClient
            const response = await http.post('/api/signup', payload);
            if (response.status !== 'Failure') {
                const data = response.payload as LoginInfos;
                await putToken('authToken', data.token);
                setIsLogin(true)
                const userInfos: User = {
                    id: data.userId,
                    name: data.userName,
                    publicName: data.publicName || data.userName,
                    email: data.email,
                    avatarUri: null,
                    level: null
                };
                setUser(userInfos)
                if (data.userId) {
                    updateActivityStreak(data.userId).then(streak => setActivityStreak(streak));
                }
            }
            return response.status
        } catch (error) {
            console.error("Create user failed:", error);
            return "Failure";
        }

    }

    async function logout(): Promise<Success> {
        await deleteToken('authToken');
        setIsLogin(false);
        setUser(undefined);
        setActivityStreak(0);
        router.push('/')
        return 'Success';
    }

    function updateAvatar(uri: string) {
        setUser(prev => prev ? { ...prev, avatarUri: uri } : prev);
    }

    async function updateUser(updates: { name?: string; email?: string; level?: string | null; password?: string, isPrivate?: boolean, phone?: string, bio?: string, publicName?: string | null }): Promise<"Success" | "Failure"> {
        setUser((prev) =>
            prev
            ? {
                ...prev,
                ...updates,
                }
            : prev
    );

        try {
            const http = await httpClient;
            const response = await http.put("/api/user", updates);

            if (response.status !== "Failure") {
            await getUser();
            }

            return response.status;
        } catch (error) {
            console.error("updateUser failed:", error);
            return "Failure";
        }
    }

    async function getPublicProfile(id: string) {
        try {
            const http = await httpClient;
            const response = await http.get(`/api/user/${id}/profile`);
            if (response.status !== 'Failure') {
                return response.payload;
            }
            return null;
        } catch (error) {
            console.error("getPublicProfile failed:", error);
            return null;
        }
    }

    async function getUserTopics(id: string) {
        try {
            const http = await httpClient;
            const response = await http.get(`/api/user/${id}/topics`);
            if (response.status !== 'Failure') {
                return response.payload;
            }
            return [];
        } catch (error) {
            console.error("getUserTopics failed:", error);
            return [];
        }
    }

    async function getUserPosts(id: string) {
        try {
            const http = await httpClient;
            const response = await http.get(`/api/user/${id}/posts`);
            if (response.status !== 'Failure') {
                return response.payload;
            }
            return [];
        } catch (error) {
            console.error("getUserPosts failed:", error);
            return [];
        }
    }

    async function getUserVegetables(id: string) {
        try {
            const http = await httpClient;
            const response = await http.get(`/api/user/${id}/vegetables`);
            if (response.status !== 'Failure') {
                return response.payload;
            }
            return [];
        } catch (error) {
            console.error("getUserVegetables failed:", error);
            return [];
        }
    }

    async function deletePost(postId: string) {
        try {
            const http = await httpClient;
            const response = await http.delete(`/api/post/${postId}`);
            return response.status !== 'Failure';
        } catch (error) {
            console.error("deletePost failed:", error);
            return false;
        }
    }

    async function deleteTopic(topicId: string) {
        try {
            const http = await httpClient;
            const response = await http.delete(`/api/topic/${topicId}`);
            return response.status !== 'Failure';
        } catch (error) {
            console.error("deleteTopic failed:", error);
            return false;
        }
    }

    async function forgotPassword(email: string): Promise<"Success" | "Failure"> {
        try {
            const http = await httpClient;
            const response = await http.post('/api/auth/forgot-password', { email });
            return response.status;
        } catch (error) {
            console.error("forgotPassword failed:", error);
            return "Failure";
        }
    }

    return {
        isLogin,
        getUser,
        login,
        createUser,
        logout,
        updateUser,
        updateAvatar,
        getPublicProfile,
        getUserTopics,
        getUserPosts,
        getUserVegetables,
        deletePost,
        deleteTopic,
        forgotPassword
    };
}
