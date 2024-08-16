import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { useUser } from '@clerk/clerk-expo'

export default function UserInfo() {

    const { user } = useUser();

    return (
        <View style={styles.containerUserInfo}>
            <Image style={styles.userImage} source={{ uri: user?.imageUrl }} />
            <Text style={styles.userName}>{user?.fullName}</Text>
            <Text style={styles.userEmail}>{user?.primaryEmailAddress?.emailAddress}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    containerUserInfo: {
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 30,
    },
    userImage: {
        width: 80,
        height: 80,
        borderRadius: 100,
        margin: 20
    },
    userName:{
        fontFamily: 'SpaceMono',
        fontSize: 20
    }
})