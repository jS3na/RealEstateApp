import React from "react";
import { StatusBar, Text } from "react-native";
import { Stack } from "expo-router";
import { useFonts } from 'expo-font';
import { ClerkProvider, SignedIn, SignedOut, ClerkLoaded } from '@clerk/clerk-expo'
import { ptBR } from "@clerk/localizations";
import * as SecureStore from 'expo-secure-store'

import Login from '../components/Login'

const tokenCache = {
  async getToken(key: string) {
    try {
      const item = await SecureStore.getItemAsync(key)
      if (item) {
        console.log(`${key} was used 🔐 \n`)
      } else {
        console.log('No values stored under key: ' + key)
      }
      return item
    } catch (error) {
      console.error('SecureStore get item error: ', error)
      await SecureStore.deleteItemAsync(key)
      return null
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value)
    } catch (err) {
      return
    }
  },
}

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

if (!publishableKey) {
  throw new Error(
    'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env',
  )
}

export default function RootLayout() {

  useFonts({
    'SpaceMono': require('../assets/fonts/SpaceMono-Regular.ttf')
  })

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey} localization={ptBR}>

      <SignedIn>
        <Stack screenOptions={{ headerShown:false }}>
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      </SignedIn>

      <SignedOut>
        <Login />
      </SignedOut>

    </ClerkProvider>
  );
}
