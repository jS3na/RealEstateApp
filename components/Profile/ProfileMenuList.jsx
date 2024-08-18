import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { FontAwesome6 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';

const PressableActionMenu = ({ action, icon, text }) => {
    return (
        <Pressable style={styles.pressableMenu} onPress={action}>
            <FontAwesome6 name={icon} size={24} color="#f7b801" />
            <Text style={styles.pressableMenuText}>{text}</Text>
        </Pressable>
    );
}

export default function ProfileMenuList() {
    const router = useRouter();
    const { signOut } = useAuth();

    const logout = () => {
        signOut();
    }

    return (
            <View style={styles.containerMenu}>
                <PressableActionMenu action={() => router.push('/myRealEstates/MyRealEstates')} icon="city" text="My Properties" />
                <PressableActionMenu action={() => router.push('/addRealEstate/AddRealEstate')} icon="arrow-right-to-city" text="Add Property" />
                <PressableActionMenu action={() => logout()} icon="door-open" text="Logout" />
                <Text style={styles.credit}>Made by Sena</Text>
            </View>
    )
}

const styles = StyleSheet.create({
    containerMenu: {
        marginTop: 30,
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: 25,
        gap: 15
    },
    pressableMenu: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 15,
        borderWidth: 1,
        borderColor: '#f7b801',
        padding: 15,
        width: '100%',
        borderRadius: 12,
        backgroundColor: '#fff',
    },
    pressableMenuText: {
        fontFamily: 'SpaceMono',
        fontSize: 18,
        color: '#333',
    },
    credit: {
        marginTop: 200,
        fontFamily: 'SpaceMono',
        fontSize: 14,
        color: '#888',
        alignSelf: 'center'
    },
});
