import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/clerk-expo';
import { useNavigation } from 'expo-router';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '../../configs/firebase';
import RealEstateByFilterCard from '../../components/Home/RealEstateByFilterCard';

export default function AllRealEstates() { //page that shows all real estates

    const user = useUser();
    const navigation = useNavigation();
    const [allRealEstates, setAllRealEstates] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: "All Real Estates"
        }),
        getAllRealEstates()
    }, []);

    const getAllRealEstates = async () => { //search all real estates availables in the firestore
        setLoading(true);
        setAllRealEstates([]);
        const queryFirestore = query(collection(firestore, 'real-estate'));
        const querySnapshot = await getDocs(queryFirestore);

        querySnapshot.forEach((doc) => {
            setAllRealEstates(prev => [...prev, {id: doc?.id, ...doc.data()}]);
        })

        setLoading(false);
    }

    return (
        <View>
            {allRealEstates?.length > 0 && !loading ?
                <FlatList
                    data={allRealEstates}
                    onRefresh={getAllRealEstates}
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