import { User } from "@/models/models";
import { createContext, ReactNode, useContext, useState } from "react";

interface UserContextType {
    user: User | undefined;
    setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
    isLogin: boolean;
    setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
    activityStreak: number;
    setActivityStreak: React.Dispatch<React.SetStateAction<number>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User>();
    const [isLogin, setIsLogin] = useState<boolean>(false);
    const [activityStreak, setActivityStreak] = useState<number>(0);

    return (
        <UserContext.Provider value={{
            user,
            setUser,
            isLogin,
            setIsLogin,
            activityStreak,
            setActivityStreak
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
