import ForumHeader from '@/components/new/forum/ForumHeader';
import ForumTabs, { TabType } from '@/components/new/forum/ForumTabs';
import { ForumFeedTab } from '@/components/new/socialTab/ForumFeedTab';
import { SocialFeedTab } from '@/components/new/socialTab/SocialFeedTab';
import { TutosFeedTab } from '@/components/new/socialTab/TutosFeedTab';
import { useState, useRef, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTour } from '@/contexts/tour.context';

export default function Index() {
    const [currentTab, setCurrentTab] = useState<TabType>('forum');
    const { registerElement, step, visible } = useTour();
    const socialFeedRef = useRef<View>(null);

    const handleOnLayout = () => {
        setTimeout(() => {
            socialFeedRef.current?.measureInWindow((x, y, w, h) => {
                if (w && h) {
                    registerElement('social_feed', { x, y, width: w, height: h });
                }
            });
        }, 200);
    };

    useEffect(() => {
        if (visible) {
            if (step === 12) {
                setCurrentTab('social');
            } else if (step === 13) {
                setCurrentTab('forum');
            } else if (step === 14) {
                setCurrentTab('tutos');
            }
        }
    }, [step, visible]);

    return (
        <View style={styles.container}>
            <ForumHeader notificationCount={27} />

            <View 
                ref={socialFeedRef}
                onLayout={handleOnLayout}
                style={{ flex: 1 }}
            >
                <ForumTabs activeTab={currentTab} setCurrentTab={setCurrentTab} />
                {
                    currentTab === 'social' &&
                    <SocialFeedTab />
                }
                {
                    currentTab === 'forum' &&
                    <ForumFeedTab />
                }
                {
                    currentTab === 'tutos' &&
                    <TutosFeedTab />
                }
            </View>
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
