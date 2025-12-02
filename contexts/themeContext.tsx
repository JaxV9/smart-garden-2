import { createContext, ReactNode, useContext } from "react";
import { StyleSheet } from "react-native";



interface ThemeContextType {
    theme: object
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {

    const theme = StyleSheet.create({
    });


    return (
        <ThemeContext.Provider value={{
            theme
        }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useThemeContext() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('error');
    }
    return context;
}