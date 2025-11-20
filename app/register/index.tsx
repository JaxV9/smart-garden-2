import { useUserContext } from '@/contexts/user.context';
import { CreateUserPayload } from '@/models/models';
import { Failure, Success } from '@jaslay/http';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function RegisterScreen() {
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');

    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const { createUser } = useUserContext()

    const validateForm = (): boolean => {
        setError(null);
        if (!name || !email || !password || !confirmPassword) {
            setError('Tous les champs sont obligatoires');
            return false;
        }
        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
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
        const userData: CreateUserPayload = {
            name,
            email,
            password
        };
        const response: Success | Failure = await createUser(userData);

        if (response === "Failure") {
            setError('Impossible de créer un compte');
            return setLoading(false);
        }
        setLoading(false)
        return router.replace('/');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Créer un compte</Text>

            {(error) && (
                <Text style={styles.errorText}>{error}</Text>
            )}

            <TextInput style={styles.input}
                placeholder="Nom d'utilisateur"
                value={name}
                onChangeText={setName} />

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none" />

            <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                value={password}
                onChangeText={setPassword}
                secureTextEntry />

            <TextInput
                style={styles.input}
                placeholder="Confirmer le mot de passe"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry />

            <TouchableOpacity
                style={styles.button}
                onPress={handleRegister}
                disabled={loading} >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>S&apos;inscrire</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.linkButton}
                onPress={() => router.replace('/login')}>
                <Text style={styles.linkText}>Retour</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
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
        color: '#4CAF50',
        fontSize: 16,
    },
    errorText: {
        color: 'red',
        marginBottom: 15,
        textAlign: 'center',
    }
});
