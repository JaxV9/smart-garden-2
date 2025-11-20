import { useUserContext } from "@/contexts/user.context";
import { router } from "expo-router";
import { useEffect } from "react";

export default function Index() {

  const { isLogin } = useUserContext()

  const checkToken = async () => {
    const hasToken = await isLogin;
    if (hasToken) {
      router.replace('/home');
    } else {
      router.replace('/login');
    }
  };

  useEffect(() => {
    checkToken();
  }, []);
}
