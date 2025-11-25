import { useUserContext } from "@/contexts/user.context";
import { useStorage } from "@/hooks/useStorage";
import { router } from "expo-router";
import { useEffect } from "react";

export default function Index() {
  const { getUser, isLogin } = useUserContext();
  const { getToken } = useStorage();

  useEffect(() => {
    const checkTokenAndRedirect = async () => {
      if (isLogin) {
        router.replace('/home');
        return;
      }

      const token = await getToken('authToken');
      if (token) {
        const userStatus = await getUser();
        if (userStatus === "Success") {
          router.replace('/home');
        } else {
          router.replace('/login');
        }
      } else {
        router.replace('/login');
      }
    };

    checkTokenAndRedirect();
  }, [isLogin]);

  return null;
}
