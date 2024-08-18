import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/clerk-expo';
import { useNavigation } from 'expo-router';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '../../configs/firebase';
import RealEstateByFilterCard from '../../components/Home/RealEstateByFilterCard';

export default function MyRealEstates() { //shows the real estates that was added from the actual user

    const user = useUser();
    const navigation = useNavigation();
    const [myRealEstates, setMyRealEstates] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: "My Real Estates"
        }),
        getMyRealEstates()
    }, []);

    const getMyRealEstates = async () => { //get all real estates from the actual user using his id
        setLoading(true);
        setMyRealEstates([]);
        const queryFirestore = query(collection(firestore, 'real-estate'), where('idUser', '==', user.user.id));
        const querySnapshot = await getDocs(queryFirestore);

        querySnapshot.forEach((doc) => {
            setMyRealEstates(prev => [...prev, {id: doc?.id, ...doc.data()}]);
        })

        setLoading(false);
    }

    return (
        <View>
            {myRealEstates?.length > 0 && !loading ?
                <FlatList
                    data={myRealEstates}
                    onRefresh={getMyRealEstates}
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