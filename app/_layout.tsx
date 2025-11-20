import { BottomSheetProvider } from "@/contexts/bottomSheetContext";
import { GardenProvider } from "@/contexts/garden.context";
import { UserProvider } from "@/contexts/user.context";
import { VegetablesProvider } from "@/contexts/vegetables.context";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <UserProvider>
      <BottomSheetProvider>
        <GardenProvider>
          <VegetablesProvider>
            <Stack screenOptions={{
              headerShown: false,
              animation: 'none',
            }} />
          </VegetablesProvider>
        </GardenProvider>
      </BottomSheetProvider>
    </UserProvider>
  );
}
