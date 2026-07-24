import { useUser } from "@/hooks/useUser";
import { LoginUserPayload } from "@/models/models";
import { Failure, Success } from "@jaslay/http";
import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View, Modal, TouchableWithoutFeedback, Alert } from "react-native";


export default function RegisterScreen() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)

    // Forgot password state
    const [forgotModalVisible, setForgotModalVisible] = useState<boolean>(false);
    const [forgotEmail, setForgotEmail] = useState<string>('');
    const [forgotLoading, setForgotLoading] = useState<boolean>(false);

    const { login, forgotPassword } = useUser()

    const validateForm = (): boolean => {
        setError(null);
        if (!email || !password) {
            setError('Tous les champs sont obligatoires');
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Format d\'email invalide');
            return false;
        }
        return true;
    };

    const handleRegister = async () => {
        setLoading(true)
        if (!validateForm()) return setLoading(false);
        const userData: LoginUserPayload = {
            email,
            password
        };
        const response: Success | Failure = await login(userData);
        if (response === "Failure") {
            setError('Impossible de se connecter');
            return setLoading(false)
        }
        setLoading(false)
        return router.replace('/');
    };

    const handleForgotPassword = async () => {
        if (!forgotEmail) {
            Alert.alert("Erreur", "Veuillez entrer votre email");
            return;
        }
        setForgotLoading(true);
        await forgotPassword(forgotEmail);
        setForgotLoading(false);
        setForgotModalVisible(false);
        setForgotEmail('');
        Alert.alert("Email envoyé", "Si ce compte existe, un email contenant votre nouveau mot de passe a été envoyé.");
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Connexion</Text>

            {(error) && (
                <Text style={styles.errorText}>{error}</Text>
            )}

            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#000000"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none" />

            <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                placeholderTextColor="#000000"
                value={password}
                onChangeText={setPassword}
                secureTextEntry />

            <TouchableOpacity style={styles.forgotPasswordContainer} onPress={() => setForgotModalVisible(true)}>
                <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={handleRegister}
                disabled={loading} >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Se connecter</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.linkButton}
                onPress={() => router.replace('/starting')}>
                <Text style={styles.linkText}>Retour</Text>
            </TouchableOpacity>

            {/* Modal Mot de passe oublié */}
            <Modal visible={forgotModalVisible} transparent animationType="fade" onRequestClose={() => setForgotModalVisible(false)}>
                <TouchableWithoutFeedback onPress={() => setForgotModalVisible(false)}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback>
                            <View style={styles.modalCard}>
                                <Text style={styles.modalTitle}>Mot de passe oublié</Text>
                                <Text style={styles.modalText}>
                                    Entrez votre adresse email. Nous vous enverrons un nouveau mot de passe temporaire.
                                </Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Votre email"
                                    placeholderTextColor="#000000"
                                    value={forgotEmail}
                                    onChangeText={setForgotEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                                <View style={styles.modalButtons}>
                                    <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setForgotModalVisible(false)}>
                                        <Text style={styles.modalCancelBtnText}>Annuler</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.modalSubmitBtn} onPress={handleForgotPassword} disabled={forgotLoading}>
                                        {forgotLoading ? <ActivityIndicator color="white" /> : <Text style={styles.modalSubmitBtnText}>Envoyer</Text>}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: "#FFFDF0",
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginBottom: 15,
        paddingHorizontal: 10,
        color: '#000000',
    },
    button: {
        backgroundColor: '#4CAF50',
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    linkButton: {
        marginTop: 15,
        alignItems: 'center',
    },
    linkText: {
        fontSize: 16,
    },
    errorText: {
        color: 'red',
        marginBottom: 15,
        textAlign: 'center',
    },
    forgotPasswordContainer: {
        alignItems: 'flex-end',
        marginBottom: 10,
    },
    forgotPasswordText: {
        color: '#4CAF50',
        fontSize: 14,
        fontWeight: '500',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 24,
        width: '100%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 10,
    },
    modalText: {
        fontSize: 14,
        color: '#4b5563',
        marginBottom: 20,
        lineHeight: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
        marginTop: 10,
    },
    modalCancelBtn: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: '#f3f4f6',
    },
    modalCancelBtnText: {
        color: '#374151',
        fontWeight: '600',
    },
    modalSubmitBtn: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: '#4CAF50',
        minWidth: 90,
        alignItems: 'center',
    },
    modalSubmitBtnText: {
        color: 'white',
        fontWeight: '600',
    },
});
