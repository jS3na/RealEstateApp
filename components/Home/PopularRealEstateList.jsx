import { StyleSheet, Text, View, FlatList, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors } from '../../constants/Colors'
import { collection, getDocs, limit, query } from 'firebase/firestore'
import { firestore } from '../../configs/firebase'
import PopularRealEstateCard from './PopularRealEstateCard'
import { useRouter } from 'expo-router'

export default function PopularRealEstateList() {

    const router = useRouter();

    const [realEstateList, setRealEstateList] = useState([]);

    useEffect(() => {
        getPopularRealEstateList();
    }, [])

    const getPopularRealEstateList = async () => {
        setRealEstateList([])
        const queryFirestore = query(collection(firestore, 'real-estate'), limit(5));
        const querySnapshot = await getDocs(queryFirestore);

        querySnapshot.forEach((doc) => {
            setRealEstateList(prev => [...prev, { id: doc?.id, ...doc.data() }]);
        })
    }

    return (
        <View>
            <View style={styles.containerTitle}>
                <Text style={styles.title}>Popular Real Estate</Text>
                <Pressable onPress={() => router.push('/allRealEstates/AllRealEstates')}>
                    <Text style={styles.titleViewAll}>View All</Text>
                </Pressable>
            </View>

            <FlatList
                data={realEstateList}
                horizontal={true}
                style={{ marginLeft: 20 }}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item, index }) => (
                    <PopularRealEstateCard realestate={item} key={index} />
                )}
            />

        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontFamily: 'SpaceMono'
    },
    titleViewAll: {
        color: Colors.PRIMARY_BOTTOM_TABS,
        fontFamily: 'SpaceMono'
    },
    containerTitle: {
        padding: 20,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10
    },
})