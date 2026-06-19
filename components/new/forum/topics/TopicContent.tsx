import { getTagStyle } from '@/constants/tagStyles';
import { getTimeAgo } from '@/utils/dateFormatter';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import TopicStats from './TopicStats';
import { useTranslation } from '@/contexts/language.context';

interface Tag {
    tag: {
        name: string;
    };
}

interface TopicContentProps {
    title: string;
    content: string;
    tags: Tag[];
    author: {
        id: string;
        name?: string;
    };
    createdAt: string;
    viewCount: number;
    commentCount: number;
}

export default function TopicContent({
    title,
    content,
    tags,
    author,
    createdAt,
    viewCount,
    commentCount,
}: TopicContentProps) {
    const router = useRouter();
    const { t, language } = useTranslation();

    return (
        <View style={styles.topicContainer}>
            <View style={styles.topicTagsContainer}>
                {tags.map((tagRelation, index) => (
                    <View
                        key={index}
                        style={[
                            styles.topicTag,
                            getTagStyle(tagRelation.tag.name),
                        ]}
                    >
                        <Text style={styles.topicTagText}>{tagRelation.tag.name}</Text>
                    </View>
                ))}
            </View>

            <Text style={styles.topicTitle}>{title}</Text>

            <View style={styles.topicMeta}>
                <View style={styles.avatarPlaceholder}>
                    <Ionicons name="person" size={20} color="#666" />
                </View>
                <View>
                    <TouchableOpacity onPress={() => router.push({ pathname: '/user/[id]', params: { id: author.id } })}>
                        <Text style={[styles.topicAuthor, { color: '#5B8E55', textDecorationLine: 'underline' }]}>
                            {author.name || t('forum_topic_unknown_user')}
                        </Text>
                    </TouchableOpacity>
                    <Text style={styles.topicTime}>{getTimeAgo(createdAt, language)}</Text>
                </View>
            </View>

            <Text style={styles.topicContent}>{content}</Text>

            <TopicStats viewCount={viewCount} commentCount={commentCount} />
        </View>
    );
}

const styles = StyleSheet.create({
    topicContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e5e5',
    },
    topicTagsContainer: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 12,
        flexWrap: 'wrap',
    },
    topicTag: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        backgroundColor: '#e5e5e5',
    },
    topicTagText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#333',
    },
    topicTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#000',
        marginBottom: 16,
        lineHeight: 32,
    },
    topicMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 12,
    },
    avatarPlaceholder: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#e5e5e5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    topicAuthor: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
    },
    topicTime: {
        fontSize: 13,
        color: '#999',
        marginTop: 2,
    },
    topicContent: {
        fontSize: 16,
        lineHeight: 24,
        color: '#333',
        marginBottom: 16,
    },
});
