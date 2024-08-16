import { FlatList, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from 'expo-router'
import * as ImagePicker from 'expo-image-picker';
import RNPickerSelect from 'react-native-picker-select';

import { firestore, storage } from '../../configs/firebase';
import { getDocs, collection, query, setDoc, doc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'

export default function AddRealEstate() {

    const navigation = useNavigation();

    const [images, setImages] = useState([]);

    const [categoriesList, setCategoriesList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [itemsQuant, setItemsQuant] = useState(0);
    const [items, setItems] = useState([]);

    const [name, setName] = useState('');
    const [about, setAbout] = useState('');
    const [neighborhood, setNeighborhood] = useState('');
    const [category, setCategory] = useState('');
    const [bathrooms, setBathrooms] = useState();
    const [rooms, setRooms] = useState();
    const [size, setSize] = useState();
    const [garage, setGarage] = useState();
    const [choosedItems, setChoosedItems] = useState([]);


    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: "Add New Real Estate"
        }),
            getCategories();
    }, []);


    const handleImagePicker = async () => {
        setImages([]);
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
            allowsMultipleSelection: true
        });

        if (!result.canceled) {
            setImages(prev => [
                ...prev,
                ...result.assets.map(asset => asset.uri)
            ]);
        }
    }

    const getCategories = async () => {
        setLoading(true);
        setCategoriesList([]);

        const queryFirestore = query(collection(firestore, 'category-home'));
        const querySnapshot = await getDocs(queryFirestore);

        querySnapshot.forEach((doc) => {
            setCategoriesList(prev => [...prev, {
                label: (doc?.data()).name,
                value: (doc?.data()).name
            }]);
        })

        setLoading(false);
    }

    const handleAddNewRealEstate = async () => {
        try {
            const uploadPromises = images.map(async (image, index) => {
                const fileName = `${Date.now()}_${index}.jpg`;
                const resp = await fetch(image);
                const blob = await resp.blob();
                const imageRef = ref(storage, 'RealEstate-app/' + fileName);

                await uploadBytes(imageRef, blob);
                console.log('Imagem carregada com sucesso:', fileName);

                const downloadUrl = await getDownloadURL(imageRef);
                return downloadUrl;
            });

            const uploadedUrls = await Promise.all(uploadPromises);

            await addRealState(uploadedUrls);
        } catch (error) {
            console.error('erro:', error);
        }
    };

    const addRealState = async (uploadedUrls) => {
        try {
            await setDoc(doc(firestore, 'real-estate', Date.now().toString()), {
                name: name,
                about: about,
                bathroom: bathrooms,
                rooms: rooms,
                size: size,
                neighborhood: neighborhood,
                garage: garage,
                images: uploadedUrls,
                category: category,
                items: choosedItems
            });
            console.log("Imóvel adicionado com sucesso!");
        } catch (error) {
            console.error('Erro ao adicionar imóvel:', error);
        }
    };

    const handleItemsQuantity = (val) => {
        const num = parseInt(val) || 0;
        setItemsQuant(num);
        setChoosedItems(Array.from({ length: num }, () => ''));
    };

    const handleItemChange = (val, index) => {
        const updatedItems = [...choosedItems];
        updatedItems[index] = val;
        setChoosedItems(updatedItems);
    };

    return (
        <ScrollView style={styles.containerAddNew}>

            <View style={styles.containerTitles}>
                <Text style={styles.title}>Add New Real Estate</Text>
                <Text>Fill all details in order to add a new Real Estate</Text>
            </View>

            {images.length == 0 ?
                <Pressable onPress={() => handleImagePicker()}>
                    <Image style={styles.cameraPlaceholder} source={require('../../assets/images/camera-picker-placeholder.png')} />
                </Pressable> :

                <FlatList
                    data={images}
                    horizontal={true}
                    style={{ marginLeft: 20, maxHeight: 170 }}
                    scro
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <Image style={styles.realEstateImage} source={{ uri: item }} />
                    )}
                    keyExtractor={(item, index) => index.toString()}
                />
            }

            <View>
                <TextInput onChangeText={(val) => setName(val)} style={styles.textInputFirebase} placeholder='Name' />
            </View>

            <View>
                <TextInput onChangeText={(val) => setAbout(val)} multiline numberOfLines={5} style={styles.textInputFirebase} placeholder='About' />
            </View>

            <View>
                <TextInput onChangeText={(val) => setNeighborhood(val)} style={styles.textInputFirebase} placeholder='Neighborhood' />
            </View>

            <View style={styles.containerTiny}>

                <View style={styles.containerTinyInner}>
                    <TextInput onChangeText={(val) => setSize(val)} inputMode='numeric' style={styles.textTinyInputFirebase} placeholder='m² size' />
                </View>

                <View style={styles.containerTinyInner}>
                    <TextInput onChangeText={(val) => setBathrooms(val)} inputMode='numeric' style={styles.textTinyInputFirebase} placeholder='Bathrooms' />
                </View>

                <View style={styles.containerTinyInner}>
                    <TextInput onChangeText={(val) => setRooms(val)} inputMode='numeric' style={styles.textTinyInputFirebase} placeholder='Rooms' />
                </View>

                <View style={styles.containerTinyInner}>
                    <TextInput onChangeText={(val) => setGarage(val)} inputMode='numeric' style={styles.textTinyInputFirebase} placeholder='Garage' />
                </View>

            </View>

            <RNPickerSelect
                onValueChange={(value) => setCategory(value)}
                items={categoriesList}
                placeholder={{
                    label: 'Select a category...',
                    value: null,
                    color: 'gray',
                }}
            />

            <Text style={styles.sectionTitle}>ITEMS</Text>

            <View style={styles.containerItems}>

                <View style={styles.containerTinyInner}>
                    <TextInput onChangeText={(val) => handleItemsQuantity(val)} inputMode='numeric' style={styles.textTinyInputFirebase} placeholder='How many items' />
                </View>

                <FlatList
                    data={choosedItems}
                    keyExtractor={(item, index) => index.toString()}
                    style={styles.flatListItems}
                    renderItem={({ item, index }) => (
                        <View style={styles.containerItemsInner}>
                            <TextInput
                                key={index}
                                style={styles.textInputItems}
                                placeholder={`Item ${index + 1}`}
                                onChangeText={(val) => handleItemChange(val, index)}
                            />
                        </View>
                    )}
                />
            </View>

            <Pressable onPress={() => handleAddNewRealEstate()} style={styles.buttonSubmit}>
                <Text style={styles.textSubmit}>Add New Real Estate!</Text>
            </Pressable>


        </ScrollView>
    )
}

const styles = StyleSheet.create({
    containerAddNew: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20,
    },
    sectionTitle: {
        fontWeight: 'bold',
        fontSize: 25,
        alignSelf: 'center'
    },
    containerTitles: {
        margin: 20
    },
    title: {
        fontWeight: 'bold',
        fontSize: 25
    },
    cameraPlaceholder: {
        width: 100,
        height: 100,
    },
    realEstateImage: {
        width: 270,
        height: 130,
        marginRight: 20,
        marginVertical: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'black',
        backgroundColor: 'green'
    },
    textInputFirebase: {
        padding: 15,
        borderWidth: 1,
        borderRadius: 20,
        margin: 10
    },
    containerTiny: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    containerTinyInner: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 20,
        margin: 20,
    },
    containerItems: {
        padding: 10,
        margin: 20,
        borderWidth: 1,
        borderRadius: 20
    },
    flatListItems: {
        padding: 10,
        margin: 5,
    },
    containerItemsInner: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 20,
        margin: 5,
    },
    buttonSubmit: {
        padding: 10,
        backgroundColor: 'lightyellow',
        borderWidth: 1,
        margin: 20,
        alignItems: 'center',
        borderRadius: 15
    }
})