import { View, Text, StyleSheet, Image, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-expo';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function Header() {

    const { user } = useUser();

    return (
        <View style={styles.container}>
                <View style={styles.containerInner}>
                    <Image style={styles.imgProfile} source={{ uri: user?.imageUrl }} />
                <View>
                    <Text style={styles.hello}>Hello, </Text>
                    <Text style={styles.name}>{user?.firstName}</Text>
                </View>
            </View>

            <View style={styles.containerSearch}>
                <AntDesign name="search1" size={24} color="#f7b801" />
                <TextInput style={styles.inputSearch} placeholder='Buscar' placeholderTextColor="#999" />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingTop: 40,
        backgroundColor: '#f7b801',
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    containerInner: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    imgProfile: {
        width: 55,
        height: 55,
        borderRadius: 100,
        borderColor: 'white',
        borderWidth: 2,
    },
    hello: {
        fontSize: 18,
        color: 'black',
        fontFamily: 'SpaceMono',
        margin: 3
    },
    name: {
        fontSize: 26,
        margin: 3,
        color: 'black',
        fontFamily: 'SpaceMono',
        fontWeight: 'bold',
    },
    containerSearch: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 10,
        marginVertical: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    inputSearch: {
        flex: 1,
        paddingLeft: 10,
        color: '#333',
        fontSize: 16,
    },
});
