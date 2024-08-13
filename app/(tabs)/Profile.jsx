import { View, Text } from 'react-native'
import React from 'react'

import { SignOutButton, useAuth } from '@clerk/clerk-expo';

export default function Profile() {

    const { user } = useAuth();
    return (
        <View>
            <Text>Profile</Text>
            <SignOutButton signOutOptions={{ user }} />
        </View>
    )
}