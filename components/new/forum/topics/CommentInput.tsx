import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface CommentInputProps {
    onSubmit: (text: string) => Promise<void>;
    placeholder?: string;
}

export default function CommentInput({ onSubmit, placeholder = "Écrire une réponse..." }: CommentInputProps) {
    const [text, setText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!text.trim() || submitting) return;
        
        setSubmitting(true);
        await onSubmit(text);
        setText('');
        setSubmitting(false);
    };

    return (
        <View style={styles.commentInputContainer}>
            <TextInput
                style={styles.commentInput}
                placeholder={placeholder}
                value={text}
                onChangeText={setText}
                multiline
                maxLength={500}
                placeholderTextColor="#999"
            />
            <TouchableOpacity
                style={[
                    styles.sendButton,
                    (!text.trim() || submitting) && styles.sendButtonDisabled
                ]}
                onPress={handleSubmit}
                disabled={!text.trim() || submitting}
            >
                {submitting ? (
                    <ActivityIndicator size="small" color="white" />
                ) : (
                    <Ionicons name="send" size={20} color="white" />
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    commentInputContainer: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#e5e5e5',
        gap: 12,
        alignItems: 'flex-end',
    },
    commentInput: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 15,
        maxHeight: 100,
        color: '#333',
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#5B8E55',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: '#ccc',
    },
});
