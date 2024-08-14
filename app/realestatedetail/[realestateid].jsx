import { ActivityIndicator, FlatList, Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { doc, getDoc, } from 'firebase/firestore';
import { firestore } from '../../configs/firebase';

import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';

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

        <ScrollView>
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

                    <View style={styles.containerDetails}>

                        <Text style={styles.title} >{realStateDetails.name}</Text>

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
                                {realStateDetails.garage == 0 ?
                                    <Text> Não </Text> :
                                    <Text>{realStateDetails.garage} Vagas</Text>
                                }
                            </View>

                            <View style={styles.containerSpecificDetail}>
                                <AntDesign name="tag" size={24} color="black" />
                                <Text>{realStateDetails.category}</Text>
                            </View>

                        </View>

                        <Text style={styles.about} >{realStateDetails.about}</Text>

                        <View style={styles.containerItems}>

                            <Text>Itens Inclusos: </Text>

                            <FlatList 
                                data={realStateDetails.items}
                                scrollEnabled={false}
                                renderItem={({item, index}) => (
                                    <View>
                                        <FontAwesome name="check" size={24} color="black" />
                                        <Text>{realStateDetails.items}</Text>
                                    </View>
                                )}
                            />

                        </View>

                    </View>
                </>
            }
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    realEstateImage: {
        width: 370,
        height: 230,
        margin: 20,
        borderRadius: 20,
    },
    containerDetails: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    about: {
        fontSize: 15,
        padding: 10,
        textAlign: 'start',
        marginLeft: 10
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
        width: '48%', // Aproximadamente metade do container, ajusta o espaçamento
        marginBottom: 10, // Espaçamento entre as linhas
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    }
})