import { Image } from "expo-image";
import { Tabs } from "expo-router";
import { Text, View } from "react-native";

export default function RootLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      animation: 'none',
      tabBarActiveTintColor: '#5B8E55',
      tabBarStyle: { paddingTop: 8 },
      tabBarLabel: ({ focused, children }) => (
        <Text style={{ marginTop: 8, color: '#5B8E55', fontWeight: focused ? 'bold' : 'normal', fontSize: 10, textAlign: 'center' }}>
          {children}
        </Text>
      ),
    }}>
      <Tabs.Screen name="home/index"
        options={{
          title: "Accueil",
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              {focused && <View style={{ position: 'absolute', top: -12, width: 42, height: 4, backgroundColor: '#5B8E55', borderRadius: 4, borderBottomRightRadius: 4 }} />}
              <Image
                source={require('@/assets/icons/home.svg')}
                style={{ width: 28, height: 28, tintColor: "#5B8E55" }}
              />
            </View>
          )
        }} />
      <Tabs.Screen name="plante/index"
        options={{
          title: "Documentation",
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              {focused && <View style={{ position: 'absolute', top: -12, width: 42, height: 4, backgroundColor: '#5B8E55', borderRadius: 4, borderBottomRightRadius: 4 }} />}
              <Image
                source={require('@/assets/icons/documentation.svg')}
                style={{ width: 30, height: 26, tintColor: '#5B8E55' }}
              />
            </View>
          )
        }} />
      <Tabs.Screen name="social/index"
        options={{
          title: "Communauté",
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              {focused && <View style={{ position: 'absolute', top: -12, width: 42, height: 4, backgroundColor: '#5B8E55', borderRadius: 4, borderBottomRightRadius: 4 }} />}
              <Image
                source={require('@/assets/icons/social.svg')}
                style={{ width: 33, height: 26, tintColor: '#5B8E55' }}
              />
            </View>
          )
        }} />
      <Tabs.Screen name="profile/index"
        options={{
          title: "Profil",
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              {focused && <View style={{ position: 'absolute', top: -12, width: 42, height: 4, backgroundColor: '#5B8E55', borderRadius: 4, borderBottomRightRadius: 4 }} />}
              <Image
                source={require('@/assets/icons/profil.svg')}
                style={{ width: 20, height: 28, tintColor: '#5B8E55' }}
              />
            </View>
          )
        }} />
    </Tabs>
  );
}