import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type TabType = 'social' | 'forum' | 'tutos';

interface ForumTabsProps {
    activeTab: TabType;
    onTabChange?: (tab: TabType) => void;
}

export default function ForumTabs({ activeTab, onTabChange }: ForumTabsProps) {
    const tabs: { id: TabType; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
        { id: 'social', label: 'Social', icon: 'chatbubbles-outline' },
        { id: 'forum', label: 'Forum', icon: 'people-outline' },
        { id: 'tutos', label: 'Tutos', icon: 'play-circle-outline' },
    ];

    return (
        <View style={styles.tabs}>
            {tabs.map((tab) => (
                <TouchableOpacity
                    key={tab.id}
                    style={[styles.tab, activeTab === tab.id && styles.tabActive]}
                    onPress={() => onTabChange?.(tab.id)}
                >
                    <Ionicons
                        name={tab.icon}
                        size={18}
                        color={activeTab === tab.id ? '#000' : '#666'}
                    />
                    <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>
                        {tab.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    tabs: {
        flexDirection: 'row',
        backgroundColor: '#e5e5e5',
        paddingVertical: 10,
        paddingHorizontal: 20,
        gap: 10,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 25,
        alignItems: 'center',
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 6,
    },
    tabActive: {
        backgroundColor: 'white',
    },
    tabText: {
        fontSize: 15,
        color: '#666',
    },
    tabTextActive: {
        color: '#000',
        fontWeight: '600',
    },
});
