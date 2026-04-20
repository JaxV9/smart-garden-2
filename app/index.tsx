import { useUserContext } from "@/contexts/user.context";
import { useStorage } from "@/hooks/useStorage";
import { useUser } from "@/hooks/useUser";
import { Image } from "expo-image";
import { router } from "expo-router";
import LottieView from 'lottie-react-native';
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";

export default function Index() {
  const { isLogin, user } = useUserContext();
  const { getUser } = useUser()
  const { getToken } = useStorage();


  useEffect(() => {
    const checkTokenAndRedirect = async () => {
      const minDelay = new Promise(resolve => setTimeout(resolve, 2000));

      const authCheck = async () => {
        if (isLogin) {
          return user?.level === null ? '/onboarding' : '/home';
        }

        const token = await getToken('authToken');
        if (token) {
          const userStatus = await getUser();
          if (userStatus === "Success") {
            return user?.level === null ? '/onboarding' : '/home';
          }
        }
        return '/starting';
      };
      const [, redirectPath] = await Promise.all([minDelay, authCheck()]);

      router.replace(redirectPath as any);
    };

    checkTokenAndRedirect();
  }, [isLogin, user]);

  return (
    <View style={styles.container}>
      <Image source={require('@/assets/icons/logoTypo.svg')} style={{ width: 176, height: 260 }} />
      <LottieView source={require('@/assets/icons/loader.json')} autoPlay loop
        style={styles.lottieLoader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: '50%',
    alignItems: 'center',
    backgroundColor: "#FFFDF0",
    gap: 64,
  },
  lottieLoader: {
    width: 100,
    height: 100,
  },
});