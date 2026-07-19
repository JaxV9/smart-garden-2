import { AppTourGuide } from "@/components/new/ui/AppTourGuide";
import { BottomSheetProvider } from "@/contexts/bottomSheetContext";
import { ForumProvider } from "@/contexts/forum.context";
import { GardenProvider } from "@/contexts/garden.context";
import { LanguageProvider } from "@/contexts/language.context";
import { NotificationProvider } from "@/contexts/notification.context";
import { RatingProvider } from "@/contexts/rating.context";
import { SocialProvider } from "@/contexts/social.context";
import { ThemeProvider } from "@/contexts/themeContext";
import { TourProvider } from "@/contexts/tour.context";
import { TutorialsProvider } from "@/contexts/tutorials.context";
import { UserProvider } from "@/contexts/user.context";
import { VegetablesProvider } from "@/contexts/vegetables.context";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
  Poppins_900Black,
  useFonts,
} from "@expo-google-fonts/poppins";
import { Stack } from "expo-router";
import Head from "expo-router/head";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform } from "react-native";

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
    <>
      {Platform.OS === "web" && (
        <Head>
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="SmartGarden" />
          <link rel="apple-touch-icon" href="/icon.png" />
          <link rel="manifest" href="/manifest.json" />
        </Head>
      )}
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
                            <RatingProvider>
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
                            </RatingProvider>
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
    </>
  );
}
