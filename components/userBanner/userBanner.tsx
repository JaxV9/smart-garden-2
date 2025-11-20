import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

type UserBannerPropsType = {
    name: string,
    email: string,
}

export const UserBanner = ({ name, email }: UserBannerPropsType) => {
    return (
        <View style={styles.userBanner}>
            <View style={styles.profilPictureContainer}>
                <Image
                    source={require('@/assets/icons/grinningFace.svg')}
                    style={styles.grinningFaceIcon}
                />
            </View>
            <View style={styles.infos}>
                <Text style={styles.userName}>{name}</Text>
                <Text style={styles.email}>{email}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    userBanner: {
        backgroundColor: "#EBECD2",
        width: "90%",
        height: 'auto',
        borderRadius: 16,
        display: 'flex',
        flexDirection: 'row',
        padding: 8,
        gap: 16,
        marginBottom: 28
    },
    grinningFaceIcon: {
        width: 64,
        height: 64,
        margin: 'auto'
    },
    profilPictureContainer: {
        width: 100,
        height: 100,
        borderRadius: 16,
    },
    infos: {
        marginTop: 'auto',
        marginBottom: 'auto',
        gap: 8
    },
    userName: {
        fontWeight: 500,
        fontSize: 18,
    },
    email: {
        fontWeight: 400,
        fontSize: 14,
    },
});
