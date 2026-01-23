import { Image } from "expo-image";
import { Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      animation: 'none',
      tabBarStyle: { paddingTop: 8 },
      tabBarLabelStyle: { marginTop: 8 },
    }}>
      <Tabs.Screen name="home/index"
        options={{
          title: "Accueil",
          tabBarIcon: ({ color }) => (
            <Image
              source={require('@/assets/icons/home.svg')}
              style={{ width: 28, height: 28, tintColor: color }}
            />
          )
        }} />
      <Tabs.Screen name="plante/index"
        options={{
          title: "Plantes",
          tabBarIcon: ({ color }) => (
            <Image
              source={require('@/assets/icons/documentation.svg')}
              style={{ width: 30, height: 26, tintColor: color }}
            />
          )
        }} />
      <Tabs.Screen name="social/index"
        options={{
          title: "Social",
          tabBarIcon: ({ color }) => (
            <Image
              source={require('@/assets/icons/social.svg')}
              style={{ width: 33, height: 26, tintColor: color }}
            />
          )
        }} />
      <Tabs.Screen name="profile/index"
        options={{
          title: "Profil",
          tabBarIcon: ({ color }) => (
            <Image
              source={require('@/assets/icons/profil.svg')}
              style={{ width: 20, height: 28, tintColor: color }}
            />
          )
        }} />
    </Tabs>
  );
}