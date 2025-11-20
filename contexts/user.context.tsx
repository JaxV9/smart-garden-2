import { useFetch } from "@/hooks/useFetch";
import { useStorage } from "@/hooks/useStorage";
import { CreateUserPayload, LoginInfos, LoginUserPayload, User } from "@/models/models";
import { Success } from "@jaslay/http";
import { router } from "expo-router";
import { createContext, ReactNode, useContext, useState } from "react";


interface UserContextType {
    user: User | undefined;
    isLogin: boolean;
    login: (payload: LoginUserPayload) => Promise<"Success" | "Failure">;
    createUser: (payload: CreateUserPayload) => Promise<"Success" | "Failure">;
    logout: () => Promise<Success>
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User>();
    const [isLogin, setIsLogin] = useState<boolean>(false);
    const { httpClient } = useFetch()
    const { putToken, getToken, deleteToken } = useStorage()

    async function login(payload: LoginUserPayload): Promise<"Success" | "Failure"> {
        try {
            const http = await httpClient
            const response = await http.post('/api/login', payload);
            console.log('Raw response:', response); // Voir la réponse complète
            console.log('Response type:', typeof response); // Vérifier le type
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

    return (
        <UserContext.Provider value={{
            user,
            isLogin,
            login,
            createUser,
            logout
        }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUserContext() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('error');
    }
    return context;
}