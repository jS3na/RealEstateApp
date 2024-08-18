import { ActivityIndicator, StyleSheet, Text, View, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '../../configs/firebase';
import RealEstateByFilterCard from '../../components/Home/RealEstateByFilterCard';

export default function RealEstateFind() {

    const { filters } = useLocalSearchParams();
    const navigation = useNavigation();

    const [filteredResult, setFilteredResult] = useState([]);
    const [loading, setLoading] = useState(false);

    const filterArray = Array.isArray(filters) ? filters : filters.split(','); //split the filters that was passed by a prop

    useEffect(() => {
        getFilteredRealEstate();
    }, [])
    
    const getFilteredRealEstate = async () => { //verify if have some Real Estate that attend the filter
        setFilteredResult([]);
        setLoading(true);

        const queryFirestore = query(collection(firestore, 'real-estate'), 
        where("category", "==", filterArray[0]), 
        where("neighborhood", "==", filterArray[1]),
        where("rooms", "==", parseInt(filterArray[2]))
    );

        const querySnapshot = await getDocs(queryFirestore);

        querySnapshot.forEach((doc) => {
            setFilteredResult(prev => [...prev, {id: doc?.id, ...doc.data()}]);
        });

        setLoading(false);

    }

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: 'Find'
        })
    }, []);

    return (
        <View>
            {filteredResult?.length > 0 && !loading ?
                <FlatList
                    data={filteredResult}
                    onRefresh={getFilteredRealEstate}
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
        marginTop: 50,
        fontFamily: 'SpaceMono',
        fontSize: 20
    }
})