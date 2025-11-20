import { Header } from "@/components/header/header";
import { MenuNavigation } from "@/components/menuNavigation/menuNavigation";
import { UserBanner } from "@/components/userBanner/userBanner";
import { useUserContext } from "@/contexts/user.context";
import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

export default function Index() {
    const { user, logout } = useUserContext()
    return (
        <View style={styles.container}>
            <Header title="Mon profil" />
            <UserBanner name={user?.name ?? 'erfer'} email={user?.email ?? 'esrger'} />
            <MenuNavigation label="Déconnexion" callback={() => logout()}>
                <Image
                    source={require('@/assets/icons/disconnectIcon.svg')}
                    style={styles.disconnectIcon}
                />
            </MenuNavigation>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        paddingTop: "15%",
        gap: 16,
        backgroundColor: "#FFFDF0",
    },
    disconnectIcon: {
        width: 28,
        height: 28,
    },
});