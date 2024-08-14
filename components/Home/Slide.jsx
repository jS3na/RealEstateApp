import { View, Text, Image, StyleSheet, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'

import { collection, getDocs, query, QuerySnapshot } from 'firebase/firestore'
import { firestore } from '../../configs/firebase'

export default function Slide() {

    const [sliderList, setSliderList] = useState([]);

    useEffect(() => {
        getSlides();
    }, [])

    const getSlides = async () => {
        setSliderList([]);
        const queryFirestore = query(collection(firestore, 'slider-home'));
        const querySnapshot = await getDocs(queryFirestore);

        querySnapshot.forEach((doc) => {
            setSliderList(prev => [...prev,doc.data()]);
        })

        await console.warn(sliderList[0].imageUrl);
    }

    return (
        <View>
            <Text style={styles.title}>
                Special for You
            </Text>

            <FlatList 
                data={sliderList}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={{paddingLeft: 20}}
                renderItem={({item, index}) => (
                    <Image style={styles.sliderImage} source={{uri: item.imageUrl}}/>
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    title:{
        fontFamily: 'SpaceMono',
        fontSize: 20,
        paddingLeft: 20,
        paddingTop: 20,
        marginBottom: 5
    },
    sliderImage:{
        width: 300,
        height: 150,
        borderRadius: 15,
        marginRight: 20
    }
});