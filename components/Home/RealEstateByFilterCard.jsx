import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';

export default function RealEstateByFilterCard({ realestate }) {
    const router = useRouter();

    const totalCost = Object.values(realestate.costDetails).reduce((sum, value) => sum + value, 0);
    const formattedTotalCost = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    }).format(totalCost);

    return (
        <Pressable
            onPress={() => router.push(`/realestatedetail/${realestate.id}`)}
            style={styles.container}
        >
            <View style={styles.card}>
                <Image style={styles.image} source={{ uri: realestate.images[0] }} />
                <View style={styles.infoContainer}>
                    <Text style={styles.price}>{formattedTotalCost}</Text>
                    <Text style={styles.subtitle}>{realestate.rooms} room(s)</Text>
                    <Text style={styles.subtitle}>{realestate.neighborhood}</Text>
                </View>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        margin: 15,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    card: {
        borderRadius: 15,
        overflow: 'hidden',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    infoContainer: {
        padding: 10,
        alignItems: 'flex-start',
        width: '100%',
    },
    price: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginTop: 5,
    },
});
