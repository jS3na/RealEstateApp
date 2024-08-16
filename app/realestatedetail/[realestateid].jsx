import { ActivityIndicator, RefreshControl, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../../configs/firebase';

import { FontAwesome, FontAwesome5, FontAwesome6, MaterialCommunityIcons, MaterialIcons, AntDesign } from '@expo/vector-icons';
import About from '../../components/RealEstateDetail/About';
import Items from '../../components/RealEstateDetail/Items';
import Values from '../../components/RealEstateDetail/Values';
import Images from '../../components/RealEstateDetail/Images';
import Reviews from '../../components/RealEstateDetail/Reviews';

export default function RealEstateDetail() {
    const [realStateDetails, setRealEstateDetails] = useState({});
    const [loading, setLoading] = useState(true);

    const navigation = useNavigation();
    const { realestateid } = useLocalSearchParams();

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: "Real Estate Detail"
        });
        getRealEstateById();
    }, []);

    const getRealEstateById = async () => {
        try {
            const docRef = doc(firestore, 'real-estate', realestateid);
            const docSnap = await getDoc(docRef);
            setRealEstateDetails({id: docSnap.id, ...docSnap.data()} || {});
        } catch (error) {
            console.error("deu erro irmao:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading ? (
                <ActivityIndicator size={60} style={{ margin: 30 }} />
            ) : (
                <ScrollView refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={getRealEstateById}
                    />
                } style={{backgroundColor: 'white'}}>

                    <Images data={realStateDetails.images} />

                    <View style={styles.containerDetails}>

                        <About title={realStateDetails.name} about={realStateDetails.about} />

                        <View style={styles.containerGridSpecificDetail}>
                            <View style={styles.containerSpecificDetail}>
                                <FontAwesome5 name="map-marker-alt" size={24} color="black" />
                                <Text>Bairro: {realStateDetails.neighborhood}</Text>
                            </View>

                            <View style={styles.containerSpecificDetail}>
                                <FontAwesome6 name="ruler" size={24} color="black" />
                                <Text>{realStateDetails.size} m²</Text>
                            </View>

                            <View style={styles.containerSpecificDetail}>
                                <MaterialCommunityIcons name="shower" size={24} color="black" />
                                <Text>{realStateDetails.bathroom} Banheiro(s)</Text>
                            </View>

                            <View style={styles.containerSpecificDetail}>
                                <MaterialIcons name="meeting-room" size={24} color="black" />
                                <Text>{realStateDetails.rooms} Quarto(s)</Text>
                            </View>

                            <View style={styles.containerSpecificDetail}>
                                <FontAwesome5 name="car" size={24} color="black" />
                                {realStateDetails.garage === 0 ?
                                    <Text> Não </Text> :
                                    <Text>{realStateDetails.garage} Vagas</Text>
                                }
                            </View>

                            <View style={styles.containerSpecificDetail}>
                                <AntDesign name="tag" size={24} color="black" />
                                <Text>{realStateDetails.category}</Text>
                            </View>
                        </View>

                        <Items data={realStateDetails.items} />

                        <Values valuesMap={realStateDetails.costDetails} />

                        <Reviews data={realStateDetails} />

                    </View>
                </ScrollView>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    containerDetails: {
        alignItems: 'center',
        width: '100%',
        justifyContent: 'flex-start'
    },
    containerGridSpecificDetail: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
        padding: 20,
        paddingLeft: 70,
    },
    containerSpecificDetail: {
        gap: 20,
        padding: 10,
        width: '48%',
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
});
