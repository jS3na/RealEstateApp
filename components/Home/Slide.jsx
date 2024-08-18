import { View, Text, Image, StyleSheet, FlatList, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'

import { collection, getDocs, limit, query } from 'firebase/firestore'
import { firestore } from '../../configs/firebase'
import { useRouter } from 'expo-router'

export default function Slide() {

    const router = useRouter();
    const [sliderList, setSliderList] = useState([]);

    useEffect(() => {
        getSlides();
    }, [])

    const getSlides = async () => {
        setSliderList([]);
        const queryFirestore = query(
            collection(firestore, 'real-estate'),
            limit(2)
        );
        const querySnapshot = await getDocs(queryFirestore);

        const slides = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        setSliderList(slides);
    }

    const renderItem = ({ item }) => (
        <Pressable onPress={() => router.push(`/realestatedetail/${item.id}`)}>
            <Image style={styles.sliderImage} source={{ uri: item.images[2] }} />
        </Pressable>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Special for You
            </Text>

            <FlatList
                data={sliderList}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                style={styles.list}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        gap: 10
    },
    title: {
        fontFamily: 'SpaceMono',
        fontSize: 20,
        paddingLeft: 20,
        paddingTop: 20,
        marginBottom: 5
    },
    sliderImage: {
        width: 350,
        height: 200,
        borderRadius: 15,
        marginHorizontal: 20
    },
});
