import { useUserContext } from "@/contexts/user.context";
import { useStorage } from "@/hooks/useStorage";
import { useUser } from "@/hooks/useUser";
import { router } from "expo-router";
import { useEffect } from "react";

export default function Index() {
  const { isLogin, user } = useUserContext();
  const { getUser } = useUser()
  const { getToken } = useStorage();


  useEffect(() => {

    const checkOnBoardingDone = async () => {
      if (user?.level === null) {
        router.replace('/onboarding');
      } else {
        router.replace('/home');
      }
    }

    const checkTokenAndRedirect = async () => {
      if (isLogin) {
        checkOnBoardingDone()
        return;
      }

      const token = await getToken('authToken');
      if (token) {
        const userStatus = await getUser();
        if (userStatus === "Success") {
          checkOnBoardingDone()
        } else {
          router.replace('/login');
        }
      } else {
        router.replace('/login');
      }
    };

    checkTokenAndRedirect();
  }, [isLogin, user]);

  return null;
}
