import ForumHeader from '@/components/new/forum/ForumHeader';
import ForumTabs, { TabType } from '@/components/new/forum/ForumTabs';
import { TrueForum } from '@/components/new/trueForum/trueForum';
import { TrueSocial } from '@/components/new/trueSocial/trueSocial';
import { TrueTutos } from '@/components/new/trueTutos/trueTutos';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';


export default function Index() {

    const [currentTab, setCurrentTab] = useState<TabType>('forum')

    return (
        <View style={styles.container}>
            <ForumHeader notificationCount={27} />

            <ForumTabs activeTab={currentTab} setCurrentTab={setCurrentTab} />
            {
                currentTab === 'social' &&
                <TrueSocial />
            }
            {
                currentTab === 'forum' &&
                <TrueForum />
            }
            {
                currentTab === 'tutos' &&
                <TrueTutos />
            }

        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    askButton: {
        backgroundColor: '#5B8E55',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    askButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});
