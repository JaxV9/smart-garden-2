import { Image } from "expo-image";
import { Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      animation: 'none',
      tabBarActiveTintColor: '#10b981', // ← Couleur verte quand sélectionné
      tabBarInactiveTintColor: '#8E8E93', // ← Couleur grise quand non sélectionné
      tabBarStyle: {
        borderTopWidth: 0.5,
        borderTopColor: '#E5E5EA',
      },
    }}>
      <Tabs.Screen 
        name="home/index"
        options={{
          title: "Accueil",
          tabBarIcon: ({ color }) => (
            <Image
              source={require('@/assets/icons/home.svg')}
              style={{ width: 28, height: 28, tintColor: color }}
            />
          )
        }} 
      />
      
      <Tabs.Screen 
        name="search/index"
        }} />
      <Tabs.Screen name="plante/index"
        options={{
          title: "Plantes",
          tabBarIcon: ({ color }) => (
            <Image
              source={require('@/assets/icons/garden.svg')}
              style={{ width: 28, height: 28, tintColor: color }}
            />
          )
        }} 
      />
      
      <Tabs.Screen 
        name="social/index"
        options={{
          title: "Social",
          tabBarIcon: ({ color }) => (
            <Image
              source={require('@/assets/icons/forum.svg')}
              style={{ width: 25, height: 28, tintColor: color }}
            />
          )
        }} 
      />
      
      <Tabs.Screen 
        name="profile/index"
        options={{
          title: "Profil",
          tabBarIcon: ({ color }) => (
            <Image
              source={require('@/assets/icons/profil.svg')}
              style={{ width: 20, height: 28, tintColor: color }}
            />
          )
        }} 
      />
    </Tabs>
  );
}
