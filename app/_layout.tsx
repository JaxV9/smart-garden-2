import { BottomSheetProvider } from "@/contexts/bottomSheetContext";
import { ForumProvider } from "@/contexts/forum.context";
import { GardenProvider } from "@/contexts/garden.context";
import { SocialProvider } from "@/contexts/social.context";
import { ThemeProvider } from "@/contexts/themeContext";
import { TutorialsProvider } from "@/contexts/tutorials.context";
import { UserProvider } from "@/contexts/user.context";
import { LanguageProvider } from "@/contexts/language.context";
import { VegetablesProvider } from "@/contexts/vegetables.context";
import { NotificationProvider } from "@/contexts/notification.context";
import { TourProvider } from "@/contexts/tour.context";
import { Stack } from "expo-router";
import { AppTourGuide } from "@/components/new/ui/AppTourGuide";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
  Poppins_900Black,
} from "@expo-google-fonts/poppins";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Poppins: Poppins_400Regular,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
    Poppins_900Black,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <UserProvider>
      <LanguageProvider>
        <ThemeProvider>
          <BottomSheetProvider>
          <VegetablesProvider>
            <GardenProvider>
              <ForumProvider>
                <SocialProvider>
                  <TutorialsProvider>
                    <NotificationProvider>
                      <TourProvider>
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
                          <Stack.Screen
                            name="premium/index"
                            options={{
                              animation: "slide_from_bottom",
                            }}
                          />
                        </Stack>
                        <AppTourGuide />
                      </TourProvider>
                    </NotificationProvider>
                  </TutorialsProvider>
                </SocialProvider>
              </ForumProvider>
            </GardenProvider>
          </VegetablesProvider>
        </BottomSheetProvider>
      </ThemeProvider>
     </LanguageProvider>
    </UserProvider>
  );
}
