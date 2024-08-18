import { View, Text, StyleSheet, Image, TextInput } from 'react-native'
import React from 'react'
import { useUser } from '@clerk/clerk-expo';
import { Colors } from '../../constants/Colors'

import AntDesign from '@expo/vector-icons/AntDesign';

export default function HeaderProfile() {

    const { user } = useUser();

    return (
        <View style={styles.container}>
                <View>
                    <Text style={styles.name}>Profile</Text>
                </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingTop: 40,
        backgroundColor: '#f7b801',
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
    },
    containerInner: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    imgProfile: {
        width: 55,
        height: 55,
        borderRadius: 100,
    },
    hello: {
        fontSize: 20,
        fontFamily: 'SpaceMono',
    },
    name: {
        fontSize: 30,
        fontFamily: 'SpaceMono',
    },
    containerSearch:{
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 10,
        marginVertical: 10,
        marginTop: 16,
        borderRadius: 10
    },
    inputSearch:{
        flex: 1,
    }
});