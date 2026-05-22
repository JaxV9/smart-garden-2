import { FlatList, StyleSheet, Text, View } from 'react-native';
import CommentCard from './CommentCard';
import EmptyComments from './EmptyComments';

interface Comment {
    id: string;
    content: string;
    createdAt: string;
    author: {
        name?: string;
    };
}

interface CommentsListProps {
    comments: Comment[];
}

export default function CommentsList({ comments }: CommentsListProps) {
    return (
        <View style={styles.commentsSection}>
            <Text style={styles.commentsTitle}>
                Réponses ({comments.length})
            </Text>

            {comments.length === 0 ? (
                <EmptyComments />
            ) : (
                <FlatList
                    data={comments}
                    renderItem={({ item }) => (
                        <CommentCard
                            author={item.author}
                            content={item.content}
                            createdAt={item.createdAt}
                        />
                    )}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={false}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    commentsSection: {
        backgroundColor: 'white',
        marginTop: 8,
        padding: 20,
        minHeight: 200,
    },
    commentsTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
        marginBottom: 16,
    },
});
