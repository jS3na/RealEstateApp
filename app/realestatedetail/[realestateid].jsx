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

export default function RealEstateDetail() { //Real Estate Detail page, shows everything
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

    const getRealEstateById = async () => { //get all Real Estates from firestore
        try {
            const docRef = doc(firestore, 'real-estate', realestateid);
            const docSnap = await getDoc(docRef);
            setRealEstateDetails({ id: docSnap.id, ...docSnap.data() } || {});
        } catch (error) {
            console.error("Error fetching real estate details:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />
            ) : (
                <ScrollView
                    refreshControl={
                        <RefreshControl refreshing={loading} onRefresh={getRealEstateById} />
                    }
                    style={styles.container}
                >
                    <Images data={realStateDetails.images} />

                    <View style={styles.detailsContainer}>

                        <About title={realStateDetails.name} about={realStateDetails.about} />

                        <View style={styles.detailsGrid}>
                            <DetailItem
                                icon={<FontAwesome5 name="map-marker-alt" size={20} color="black" />}
                                text={`${realStateDetails.neighborhood}`}
                            />
                            <DetailItem
                                icon={<FontAwesome6 name="ruler" size={20} color="black" />}
                                text={`${realStateDetails.size} m²`}
                            />
                            <DetailItem
                                icon={<MaterialCommunityIcons name="shower" size={20} color="black" />}
                                text={`${realStateDetails.bathroom} Bathroom(s)`}
                            />
                            <DetailItem
                                icon={<MaterialIcons name="meeting-room" size={20} color="black" />}
                                text={`${realStateDetails.rooms} Bedroom(s)`}
                            />
                            <DetailItem
                                icon={<FontAwesome5 name="car" size={20} color="black" />}
                                text={realStateDetails.garage === 0 ? "No" : `${realStateDetails.garage} Parking Space`}
                            />
                            <DetailItem
                                icon={<AntDesign name="tag" size={20} color="black" />}
                                text={realStateDetails.category}
                            />
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

const DetailItem = ({ icon, text }) => (
    <View style={styles.detailItem}>
        {icon}
        <Text style={styles.detailText}>{text}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f8f8f8',
        flex: 1,
    },
    loadingIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 30,
    },
    detailsContainer: {
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 20,
    },
    detailsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: 15,
        marginVertical: 10,
    },
    detailItem: {
        width: '48%',
        padding: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 10,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    detailText: {
        fontSize: 16,
        color: '#333',
        marginLeft: 10,
    },
});
