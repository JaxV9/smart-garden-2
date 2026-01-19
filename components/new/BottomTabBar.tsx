import { Image } from "expo-image";
import { usePathname, useRouter } from "expo-router";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type TabRoute = '/home' | '/search' | '/forum' | '/profile';

interface BottomTabBarProps {
    activeTab?: TabRoute; // Permet de forcer un onglet actif
}

export default function BottomTabBar({ activeTab }: BottomTabBarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const insets = useSafeAreaInsets();

    const tabs = [
        {
            route: '/home' as TabRoute,
            title: 'Accueil',
            icon: require('@/assets/icons/home.svg'),
            iconSize: { width: 28, height: 28 },
        },
        {
            route: '/search' as TabRoute,
            title: 'Plantes',
            icon: require('@/assets/icons/search.svg'),
            iconSize: { width: 28, height: 28 },
        },
        {
            route: '/forum' as TabRoute,
            title: 'Social',
            icon: require('@/assets/icons/garden.svg'),
            iconSize: { width: 25, height: 28 },
        },
        {
            route: '/profile' as TabRoute,
            title: 'Profil',
            icon: require('@/assets/icons/profil.svg'),
            iconSize: { width: 20, height: 28 },
        },
    ];

    const isTabActive = (route: TabRoute) => {
        // Si activeTab est fourni, l'utiliser
        if (activeTab) {
            return activeTab === route;
        }

        // Sinon, détecter automatiquement depuis l'URL
        if (route === '/home') {
            return pathname === '/' || pathname === '/home' || pathname.startsWith('/home/');
        }
        
        // Pour /forum, inclure aussi /social et /tutos
        if (route === '/forum') {
            return pathname.startsWith('/social') || 
                   pathname.startsWith('/forum') || 
                   pathname.startsWith('/tutos');
        }
        
        return pathname.startsWith(route);
    };

    const handleTabPress = (route: TabRoute) => {
        // @ts-ignore
        router.push(route);
    };

    const activeColor = '#10b981'; // Vert
    const inactiveColor = '#8E8E93';
    const backgroundColor = Platform.OS === 'ios' ? 'rgba(249, 249, 249, 0.94)' : '#FFFFFF';

    return (
        <View 
            style={[
                styles.container, 
                { 
                    backgroundColor,
                    height: 49 + insets.bottom,
                    paddingBottom: insets.bottom,
                }
            ]}
        >
            <View style={styles.tabsContainer}>
                {tabs.map((tab) => {
                    const isActive = isTabActive(tab.route);
                    const color = isActive ? activeColor : inactiveColor;

                    return (
                        <TouchableOpacity
                            key={tab.route}
                            style={styles.tab}
                            onPress={() => handleTabPress(tab.route)}
                            activeOpacity={0.7}
                        >
                            <Image
                                source={tab.icon}
                                style={[tab.iconSize, { tintColor: color }]}
                            />
                            <Text style={[styles.label, { color }]}>
                                {tab.title}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#E5E5EA',
        zIndex: 999,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -3 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
            },
            android: {
                elevation: 16,
            },
        }),
    },
    tabsContainer: {
        flexDirection: 'row',
        height: 49,
        alignItems: 'center',
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        gap: 1,
    },
    label: {
        fontSize: 10,
        fontWeight: '500',
        textAlign: 'center',
        marginTop: -2,
    },
});
