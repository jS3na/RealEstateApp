import { StyleSheet, Text, View, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors } from '../../constants/Colors'
import { collection, getDocs, limit, query } from 'firebase/firestore'
import { firestore } from '../../configs/firebase'
import PopularRealEstateCard from './PopularRealEstateCard'

export default function PopularRealEstateList() {

    const [realEstateList, setRealEstateList] = useState([]);

    useEffect(() => {
        getPopularRealEstateList();
    }, [])

    const getPopularRealEstateList = async () => {
        setRealEstateList([])
        const queryFirestore = query(collection(firestore, 'real-estate'), limit(5));
        const querySnapshot = await getDocs(queryFirestore);

        querySnapshot.forEach((doc) => {
            setRealEstateList(prev => [...prev, {id: doc?.id, ...doc.data()}]);
        })
    }

    return (
        <View>
            <View style={styles.containerTitle}>
                <Text style={styles.title}>Popular Real Estate</Text>
                <Text style={styles.titleViewAll}>View All</Text>
            </View>

            <FlatList 
                data={realEstateList}
                horizontal={true}
                style={{marginLeft: 20}}
                showsHorizontalScrollIndicator={false}
                renderItem={({item,index}) => (
                    <PopularRealEstateCard realestate={item} key={index} />
                )}
            />

        </View>
    )
}

const styles = StyleSheet.create({
    title:{
        fontSize: 20,
        fontFamily: 'SpaceMono'
    },
    titleViewAll:{
        color: Colors.PRIMARY_BOTTOM_TABS,
        fontFamily: 'SpaceMono'
    },
    containerTitle:{
        padding: 20,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10
    },
})