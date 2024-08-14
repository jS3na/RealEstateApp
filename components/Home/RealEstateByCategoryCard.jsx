import { StyleSheet, Text, View, Image, Pressable } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router';

export default function RealEstateByCategoryCard({ realestate }) {

    const router = useRouter();

    const totalCost = Object.values(realestate.costDetails).reduce((sum, value) => sum + value, 0);
    const formattedTotalCost = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2
    }).format(totalCost);

    return (
        <Pressable onPress={() => router.push('/realestatedetail/'+realestate.id)} style={styles.containerRealEstateCategory}>
            <View style={styles.Card}>
                <Image style={styles.realEstateImage} source={{ uri: realestate.images[0] }} />
                <Text style={styles.realEstateValue}>{formattedTotalCost}</Text>
                <Text style={styles.realEstateSubtitle}>{realestate.rooms} quarto(s)</Text>
                <Text style={styles.realEstateSubtitle}>Bairro {realestate.neighborhood}</Text>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    containerRealEstateCategory: {
        margin: 20,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 15
    },
    Card: {
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5
    },
    realEstateImage: {
        width: 370,
        height: 230,
        borderRadius: 15
    },
    realEstateSubtitle: {
        alignSelf: 'flex-start',
        marginLeft: 13,
        color: 'gray'
    },
    realEstateValue: {
        alignSelf: 'flex-start',
        marginLeft: 13,
        fontWeight: 'bold',
        fontSize: 30
    }
})