import { useThemeContext } from "@/contexts/themeContext";


export function useTheme() {
    const { theme } = useThemeContext()
    return { theme };
}
