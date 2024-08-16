import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '../../configs/firebase';

import RealEstateByFilterCard from '../../components/Home/RealEstateByFilterCard';

export default function RealEstateListByCategory() {

    const [RealEstateByCategory, setRealEstateByCategory] = useState([]);

    const [loading, setLoading] = useState(false);

    const navigation = useNavigation();
    const { category } = useLocalSearchParams();

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: category
        }),
            getRealEstateList();
    }, []);

    const getRealEstateList = async () => {
        setLoading(true)
        setRealEstateByCategory([]);
        const queryFirestore = query(collection(firestore, 'real-estate'), where("category", "==", category));
        const querySnapshot = await getDocs(queryFirestore);

        querySnapshot.forEach((doc) => {
            setRealEstateByCategory(prev => [...prev, {id: doc?.id, ...doc.data()}]);
        })

        setLoading(false)

    }

    return (
        <View>
            {RealEstateByCategory?.length > 0 && !loading ?
                <FlatList
                    data={RealEstateByCategory}
                    onRefresh={getRealEstateList}
                    refreshing={loading}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item, index }) => (
                        <RealEstateByFilterCard realestate={item} key={index} />
                    )}
                /> :

                loading ? <ActivityIndicator size={60} style={{ margin: 30 }} /> :

                    <Text style={styles.notFoundText}>
                        No Real Estate Found
                    </Text>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    notFoundText: {
        alignSelf: 'center',
        fontSize: 20,
        fontFamily: 'SpaceMono',
        margin: 10
    }
})