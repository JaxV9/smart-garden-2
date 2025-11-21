import { useUserContext } from "@/contexts/user.context";
import { useStorage } from "@/hooks/useStorage";
import { router } from "expo-router";
import { useEffect } from "react";

export default function Index() {

  const { getUser } = useUserContext()
  const { getToken } = useStorage()

  const checkToken = async () => {
    const hasToken = await getToken('authToken');
    if (hasToken) {
      const user = await getUser()
      if (user !== "Failure") {
        return router.replace('/home');
      }
      return router.replace('/login');
    }
    router.replace('/login');
  };

  useEffect(() => {
    checkToken();
  }, []);
}
