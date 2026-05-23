import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';


export type TabType = 'social' | 'forum' | 'tutos';


interface ForumTabsProps {
    activeTab?: TabType;
    setCurrentTab: React.Dispatch<React.SetStateAction<TabType>>
}


export default function ForumTabs({ activeTab, setCurrentTab }: ForumTabsProps) {
    const router = useRouter();
    const pathname = usePathname();

    const tabs: { id: TabType; label: string; icon: keyof typeof Ionicons.glyphMap; route: string }[] = [
        { id: 'social', label: 'Social', icon: 'chatbubbles-outline', route: '/socia' },
        { id: 'forum', label: 'Forum', icon: 'people-outline', route: '/(tabs)/social' },
        { id: 'tutos', label: 'Tutos', icon: 'play-circle-outline', route: '/tutos' },
    ];



    const navigate = (tabId: TabType) => {
        setCurrentTab(tabId)
    };


    return (
        <View style={styles.tabs}>
            {tabs.map((tab) => (
                <TouchableOpacity
                    key={tab.id}
                    style={[styles.tab, activeTab === tab.id && styles.tabActive]}
                    onPress={() => navigate(tab.id)}
                >
                    <Ionicons
                         name={tab.icon}
                         size={18}
                         color={activeTab === tab.id ? '#1F2937' : '#6B7280'}
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
         backgroundColor: '#F3F4F6',
         borderRadius: 14,
         padding: 4,
         marginHorizontal: 20,
         marginTop: 16,
         marginBottom: 8,
     },
     tab: {
         flex: 1,
         paddingVertical: 10,
         borderRadius: 10,
         alignItems: 'center',
         backgroundColor: 'transparent',
         flexDirection: 'row',
         justifyContent: 'center',
         gap: 6,
     },
     tabActive: {
         backgroundColor: '#FFFFFF',
         shadowColor: '#000',
         shadowOffset: { width: 0, height: 2 },
         shadowOpacity: 0.08,
         shadowRadius: 4,
         elevation: 2,
     },
     tabText: {
         fontSize: 14,
         fontWeight: '600',
         color: '#6B7280',
     },
     tabTextActive: {
         color: '#1F2937',
         fontWeight: '800',
     },
 });
