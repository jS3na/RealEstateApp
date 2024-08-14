import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { doc, getDoc, } from 'firebase/firestore';
import { firestore } from '../../configs/firebase';

export default function RealEstateDetail() {

    const [realStateDetails, setRealEstateDetails] = useState([])
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation();
    const { realestateid } = useLocalSearchParams();

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: "Real Estate Detail"
        }),
            getRealEstateById();
    }, []);

    const getRealEstateById = async () => {

        setRealEstateDetails([]);
        setLoading(true);

        const docRef = doc(firestore, 'real-estate', realestateid);
        const docSnap = await getDoc(docRef);

        setRealEstateDetails(docSnap.data())
        setLoading(false);
    }

    return (

        <View>
            {loading ? <ActivityIndicator size={60} style={{ margin: 30 }} /> :

                <>
                    <FlatList
                        data={realStateDetails.images}
                        horizontal={true}
                        style={{ marginLeft: 20 }}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item, index }) => (
                            <Image style={styles.realEstateImage} source={{ uri: item }} key={index} />
                        )}
                    />

                    <Text>{realStateDetails.name}</Text>
                    <Text>{realStateDetails.about}</Text>

                    <View>
                        
                    </View>
                </>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    realEstateImage: {
        width: 370,
        height: 230,
        margin: 20,
        borderRadius: 20,
    }
})