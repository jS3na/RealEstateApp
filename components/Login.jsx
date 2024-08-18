import React, { useState, useCallback } from 'react';
import { useSignIn } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { Text, TextInput, View, StyleSheet, Pressable, StatusBar } from 'react-native';

import { useOAuth } from '@clerk/clerk-expo';
import { useWarmUpBrowser } from '../hooks/useWarmUpBrowser';
import * as WebBrowser from 'expo-web-browser';

import AntDesign from '@expo/vector-icons/AntDesign';

WebBrowser.maybeCompleteAuthSession();

export default function Login() {

    useWarmUpBrowser();

    const { signIn, setActive, isLoaded } = useSignIn();
    const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

    const router = useRouter();

    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');

    const [errorMessage, setErrorMessage] = useState('');

    const ErrorMessage = ({ message }) =>
        message ? <Text style={styles.errorText}>{message}</Text> : null;

    const onSignEmailPass = useCallback(async () => {
        if (!isLoaded) {
            return;
        }

        try {
            const signInAttempt = await signIn.create({
                identifier: emailAddress,
                password,
            });

            if (signInAttempt.status === 'complete') {
                await setActive({ session: signInAttempt.createdSessionId });
                router.replace('/');
            } else {
                console.error(JSON.stringify(signInAttempt, null, 2));
            }
        } catch (err) {
            const errorMessage = err.errors[0]?.message || 'Error.';

            if (errorMessage.toLowerCase().includes('enter password')) {
                setErrorMessage('Enter Password');
            } else {
                setErrorMessage(errorMessage);
            }
        }
    }, [isLoaded, emailAddress, password]);

    const onSignOAuth = useCallback(async () => {
        try{
            const { createdSessionId, signIn, signUp, setActive} =
                await startOAuthFlow();

            if(createdSessionId){
                setActive({ session: createdSessionId });
            }
            else{

            }
        }
        catch(err) {
            console.error("OAuth error", err);
        }
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            <View style={styles.header}>
                <Text style={styles.title}>Real Estate App</Text>
            </View>

            <TextInput
                autoCapitalize="none"
                value={emailAddress}
                placeholder="E-mail"
                placeholderTextColor="#666"
                onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
                style={styles.input}
            />

            <TextInput
                value={password}
                placeholder="Senha"
                placeholderTextColor="#666"
                secureTextEntry={true}
                onChangeText={(password) => setPassword(password)}
                style={styles.input}
            />

            <ErrorMessage message={errorMessage} />

            <Pressable style={styles.button} onPress={onSignEmailPass}>
                <Text style={styles.buttonText}>Login</Text>
            </Pressable>

            <Pressable style={styles.oAuthButton} onPress={onSignOAuth}>
                <AntDesign name="google" size={24} color="white" />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
    },
    header: {
        marginBottom: 50,
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#f7b801',
    },
    input: {
        marginBottom: 20,
        padding: 15,
        borderColor: '#f7b801',
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: '#fff',
        color: '#333',
        fontSize: 16,
        width: '100%',
    },
    button: {
        backgroundColor: '#f7b801',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
        width: '100%',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    oAuthButton: {
        backgroundColor: '#f7b801',
        padding: 15,
        borderRadius: 50,
        alignItems: 'center',
        alignSelf: 'center',
        width: 60,
        height: 60,
        justifyContent: 'center',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 10,
    },
});
