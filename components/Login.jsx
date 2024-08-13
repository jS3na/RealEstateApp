import React, { useState, useCallback, useEffect } from 'react'
import { useSignIn } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { Text, TextInput, View, StyleSheet, Pressable, StatusBar } from 'react-native'

import { useOAuth } from '@clerk/clerk-expo'
import { useWarmUpBrowser  } from '@/hooks/useWarmUpBrowser'
import * as WebBrowser from 'expo-web-browser'

import AntDesign from '@expo/vector-icons/AntDesign';

WebBrowser.maybeCompleteAuthSession();

export default function Login() {

    useWarmUpBrowser();

    const { signIn, setActive, isLoaded } = useSignIn()
    const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' })

    const router = useRouter()

    const [emailAddress, setEmailAddress] = useState('')
    const [password, setPassword] = useState('')

    const [errorMessage, setErrorMessage] = useState('');

    const ErrorMessage = ({ message }) => (
        message ? <Text style={{ color: 'red', textAlign: 'center' }}>{message}</Text> : null
    );

    const onSignEmailPass = useCallback(async () => {
        if (!isLoaded) {
            return
        }

        try {
            const signInAttempt = await signIn.create({
                identifier: emailAddress,
                password,
            })

            if (signInAttempt.status === 'complete') {
                await setActive({ session: signInAttempt.createdSessionId })
                router.replace('/')
            } else {
                console.error(JSON.stringify(signInAttempt, null, 2))
            }
        } catch (err) {
            const errorMessage = err.errors[0]?.message || 'Ocorreu um erro ao tentar fazer login.';

            if (errorMessage.toLowerCase().includes('enter password')) {
                setErrorMessage('Insira uma senha');
            } else {
                setErrorMessage(errorMessage);
            }

        }
    }, [isLoaded, emailAddress, password])

    const onSignOAuth = useCallback(async () => {
        try {
            const { createdSessionId, signIn, signUp, setActive } = await startOAuthFlow();

            if (setActive && createdSessionId) {
                setActive({ session: createdSessionId })
            } else {
            }
        } catch (err) {
            console.error('OAuth error', err)
        }
    }, [])


    return (
        <View style={styles.container}>

            <TextInput
                autoCapitalize="none"
                value={emailAddress}
                placeholder="E-Mail"
                onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
                style={styles.labelLogin}
            />

            <TextInput
                value={password}
                placeholder="Senha"
                secureTextEntry={true}
                onChangeText={(password) => setPassword(password)}
                style={styles.labelLogin}
            />

            <ErrorMessage message={errorMessage} />

            <Pressable style={styles.buttonLogin} onPress={onSignEmailPass}>
                <Text>Login</Text>
            </Pressable>

            <Pressable style={styles.buttonLoginOAuth} onPress={onSignOAuth}>
                <AntDesign name="google" size={24} color="black" />
            </Pressable>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    labelLogin: {
        marginBottom: 20,
        marginHorizontal: 20,
        padding: 10,
        textAlign: 'center',
        borderStyle: 'solid',
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 10
    },
    buttonLogin: {
        margin: 30,
        backgroundColor: 'lightblue',
        alignItems: 'center',
        padding: 10,
        borderRadius: 15
    },
    buttonLoginOAuth:{
        padding: 10,
        alignItems: 'center',
        width: 50,
        alignSelf: 'center',
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 10
    }
});