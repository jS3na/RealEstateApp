import { StyleSheet, Text, View, Image, Pressable } from 'react-native'
import React from 'react'

import { useRouter } from 'expo-router';

export default function PopularRealEstateCard({realestate}) {

    const router = useRouter();

    return (
        <Pressable onPress={() => router.push('/realestatedetail/'+realestate.id)} style={styles.containerCard}>
            <Image style={styles.sliderImage} source={{uri: realestate.images[0]}}/>
            <Text style={styles.realEstateTitle}>{realestate.name}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    containerCard:{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 20,
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 20
    },
    sliderImage:{
        width: 270,
        height: 130,
        borderRadius: 15,
    },
    realEstateTitle:{
        fontFamily: 'SpaceMono',
        fontSize: 12,
        width: 270,
        textAlign: 'center',
        margin: 5

    }
})