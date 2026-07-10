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
import { RatingProvider } from "@/contexts/rating.context";
import { Stack } from "expo-router";
import { AppTourGuide } from "@/components/new/ui/AppTourGuide";
import Head from "expo-router/head";
import { useFonts } from 'expo-font';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'Ionicons': require('../assets/fonts/Ionicons.ttf'),
    'Feather': require('../assets/fonts/Feather.ttf'),
  });

  if (error) {
    console.error("Error loading PWA fonts:", error);
  }

  if (!loaded) {
    return null;
  }

  return (
    <>
      <Head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SmartGarden" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
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
