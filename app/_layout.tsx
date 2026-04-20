import { BottomSheetProvider } from "@/contexts/bottomSheetContext";
import { ForumProvider } from "@/contexts/forum.context";
import { GardenProvider } from "@/contexts/garden.context";
import { SocialProvider } from "@/contexts/social.context";
import { ThemeProvider } from "@/contexts/themeContext";
import { TutorialsProvider } from "@/contexts/tutorials.context";
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
              <ForumProvider>
                <SocialProvider>
                  <TutorialsProvider>
                    <Stack
                      screenOptions={{
                        headerShown: false,
                        animation: "none",
                      }}
                    >
                      <Stack.Screen
                        name="vegetable/[vegetableId]/index"
                        options={{
                          animation: "slide_from_right",
                        }}
                      />
                    </Stack>
                  </TutorialsProvider>
                </SocialProvider>
              </ForumProvider>
            </GardenProvider>
          </VegetablesProvider>
        </BottomSheetProvider>
      </ThemeProvider>
    </UserProvider>
  );
}
