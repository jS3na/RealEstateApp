import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'

import { FontAwesome6 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const PressableActionMenu = ({ action, icon, text }) => {
    return (
        <Pressable style={styles.pressableMenu} onPress={action}>
            <FontAwesome6 name={icon} size={24} color="black" />
            <Text style={styles.pressableMenuText}>{text}</Text>
        </Pressable>
    );
}

export default function ProfileMenuList() {

    const router = useRouter();
    
    return (
        <View style={styles.containerMenu}>

            <PressableActionMenu action={() => console.warn('tocou')} icon="city" text="My Properties" />
            <PressableActionMenu action={() => router.push('/addRealEstate/AddRealEstate')} icon="arrow-right-to-city" text="Add Property" />
            <PressableActionMenu action={() => console.warn('tocou')} icon="door-open" text="Logout" />

        </View>
    )
}

const styles = StyleSheet.create({
    containerMenu:{
        marginTop: 30,
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingLeft: 40,
        gap: 15
    },
    pressableMenu: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 15,
        borderWidth: 1,
        padding: 20,
        width: '90%',
        justifyContent: 'flex-start',
        borderRadius: 20,
        backgroundColor: 'lightyellow'
    },
    pressableMenuText: {
        fontFamily: 'SpaceMono',
        fontSize: 23
    }
})