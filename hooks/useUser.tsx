import { useUserContext } from "@/contexts/user.context";
import { CreateUserPayload, LoginInfos, LoginUserPayload, User } from "@/models/models";
import { Success } from "@jaslay/http";
import { router } from "expo-router";
import { useFetch } from "./useFetch";
import { useStorage } from "./useStorage";



export function useUser() {
    const { setUser, isLogin, setIsLogin } = useUserContext()
    const { httpClient } = useFetch(undefined)
    const { putToken, getToken, deleteToken } = useStorage()

    async function getUser(): Promise<"Success" | "Failure"> {
        try {
            const http = await httpClient
            const response = await http.get('/api/user');
            if (response.status !== 'Failure') {
                const data = response.payload as User
                const userInfos: User = {
                    name: data.name,
                    email: data.email,
                    level: data.level
                };
                setUser(userInfos)
                setIsLogin(true)
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
                if (isTokenAlreadyExists !== null) {
                    await deleteToken('authToken');
                }
                await putToken('authToken', data.token);
                setIsLogin(true)
                const userInfos: User = {
                    name: data.userName,
                    email: data.email,
                    avatarUri: null,
                    level: data.level
                };
                setUser(userInfos)
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
                    name: data.userName,
                    email: data.email,
                    avatarUri: null,
                    level: null
                };
                setUser(userInfos)
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
        router.push('/')
        return 'Success';
    }

    function updateAvatar(uri: string) {
        setUser(prev => prev ? { ...prev, avatarUri: uri } : prev);
    }

    function updateUser(updates: { name?: string; email?: string }) {
        setUser((prev) =>
            prev
                ? {
                    ...prev,
                    ...updates,
                }
                : prev
        );
    }

    return {
        isLogin,
        getUser,
        login,
        createUser,
        logout,
        updateUser,
        updateAvatar
    };
}
