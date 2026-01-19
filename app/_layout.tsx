import { BottomSheetProvider } from "@/contexts/bottomSheetContext";
import { ForumProvider } from "@/contexts/forum.context";
import { GardenProvider } from "@/contexts/garden.context";
import { ThemeProvider } from "@/contexts/themeContext";
import { UserProvider } from "@/contexts/user.context";
import { VegetablesProvider } from "@/contexts/vegetables.context";
import { Stack } from "expo-router";


export default function RootLayout() {
  return (
    <UserProvider>
      <ThemeProvider>
        <BottomSheetProvider>
          <VegetablesProvider>
            <GardenProvider>
              <Stack screenOptions={{
                headerShown: false,
                animation: 'none',
              }} />
            </GardenProvider>
          </VegetablesProvider>
        </BottomSheetProvider>
      </ThemeProvider>
    </UserProvider>
  );
}
