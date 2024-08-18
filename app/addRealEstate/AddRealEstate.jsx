import { FlatList, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, ToastAndroid, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from 'expo-router'
import * as ImagePicker from 'expo-image-picker';
import RNPickerSelect from 'react-native-picker-select';

import { firestore, storage } from '../../configs/firebase'; //db connection
import { getDocs, collection, query, setDoc, doc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { useUser } from '@clerk/clerk-expo';

export default function AddRealEstate() {

    const user = useUser();

    const navigation = useNavigation();

    const [images, setImages] = useState([]);

    //to now if the user will set the title or the value of costDetails
    const [valuesStage, setValuesStage] = useState(false);

    const [categoriesList, setCategoriesList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [itemsQuant, setItemsQuant] = useState(0);
    const [valuesQuant, setValuesQuant] = useState(0);

    //what will be send to the firebase
    const [name, setName] = useState('');
    const [about, setAbout] = useState('');
    const [neighborhood, setNeighborhood] = useState('');
    const [category, setCategory] = useState('');
    const [bathrooms, setBathrooms] = useState();
    const [rooms, setRooms] = useState();
    const [size, setSize] = useState();
    const [garage, setGarage] = useState();
    const [choosedItems, setChoosedItems] = useState([]);

    //temporary variables that storage the title and values of costDetails
    const [choosedCostTitles, setChoosedCostTitles] = useState([]);
    const [choosedCostValues, setChoosedCostValues] = useState([]);

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: "Add New Real Estate"
        }),
            getCategories();
    }, []);

    const handleImagePicker = async () => { //function that allow us to pick the images
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

    const getCategories = async () => { //to get the categories available
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

    const generateCostDetailsMap = () => { //to set the costDetails using the values of choosedCostTitles and choosedCostValues
        let updatedDetails = {};
        choosedCostTitles.forEach((doc, index) => {
            updatedDetails[doc] = parseInt(choosedCostValues[index]);
        });
        return updatedDetails;
    };

    const validateFields = () => { //validade the user entry, if some input is missing
        return name.trim() !== '' &&
            about.trim() !== '' &&
            neighborhood.trim() !== '' &&
            size > 0 &&
            bathrooms > 0 &&
            rooms > 0 &&
            garage >= 0 &&
            category !== '' &&
            choosedItems.length > 0 &&
            choosedCostTitles.length === choosedCostValues.length;
    };

    const handleAddNewRealEstate = async () => { //function that upload the images to the firebase storage and get their url's to set in firestore

        if (!validateFields()) {
            ToastAndroid.show('Please fill in all required fields.', ToastAndroid.SHORT);
            return;
        }

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

    const addRealState = async (uploadedUrls) => { //finally, the function that send the data for firebase, creating a new document
        const choosedCostDetails = generateCostDetailsMap();
        try {
            await setDoc(doc(firestore, 'real-estate', Date.now().toString()), {
                name: name,
                about: about,
                bathroom: parseInt(bathrooms),
                rooms: parseInt(rooms),
                size: parseInt(size),
                neighborhood: neighborhood,
                garage: parseInt(garage),
                images: uploadedUrls,
                category: category,
                items: choosedItems,
                costDetails: choosedCostDetails,
                idUser: user.user.id
            });
            ToastAndroid.show('Real Estate Added Successfully!', ToastAndroid.BOTTOM);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleQuantity = (setterQuant, setterChoosed, val) => { //function that is used for set the quantity of inputs of items and costDetails data
        const num = parseInt(val) || 0;
        setterQuant(num);
        setterChoosed(Array.from({ length: num }, () => ''));
    };

    const handleVectorChange = (choosedX, setChoosedX, val, index) => { //set the data of choosedX
        const updated = [...choosedX];
        updated[index] = val;
        setChoosedX(updated);
    };

    return (
        <ScrollView style={styles.containerAddNew}>

            <View style={styles.containerTitles}>
                <Text style={styles.title}>Add New Real Estate</Text>
                <Text style={styles.subtitle}>Fill all details in order to add a new Real Estate</Text>
            </View>

            {images.length === 0 ?
                <Pressable onPress={() => handleImagePicker()}>
                    <Image style={styles.cameraPlaceholder} source={require('../../assets/images/camera-picker-placeholder.png')} />
                </Pressable> :
                <FlatList
                    data={images}
                    horizontal={true}
                    style={styles.imageList}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <Image style={styles.realEstateImage} source={{ uri: item }} />
                    )}
                    keyExtractor={(item, index) => index.toString()}
                />
            }

            <View style={styles.inputContainer}>
                <TextInput onChangeText={(val) => setName(val)} style={styles.textInput} placeholder='Name' />
                <TextInput onChangeText={(val) => setAbout(val)} multiline numberOfLines={5} style={styles.textInput} placeholder='About' />
                <TextInput onChangeText={(val) => setNeighborhood(val)} style={styles.textInput} placeholder='Neighborhood' />
            </View>

            <View style={styles.containerTiny}>
                <TextInput onChangeText={(val) => setSize(val)} inputMode='numeric' style={styles.textTinyInput} placeholder='m² size' />
                <TextInput onChangeText={(val) => setBathrooms(val)} inputMode='numeric' style={styles.textTinyInput} placeholder='Bathrooms' />
                <TextInput onChangeText={(val) => setRooms(val)} inputMode='numeric' style={styles.textTinyInput} placeholder='Rooms' />
                <TextInput onChangeText={(val) => setGarage(val)} inputMode='numeric' style={styles.textTinyInput} placeholder='Garage' />
            </View>

            <RNPickerSelect
                onValueChange={(value) => setCategory(value)}
                items={categoriesList}
                placeholder={{
                    label: 'Select a category...',
                    value: null,
                    color: 'gray',
                }}
                style={pickerSelectStyles}
            />

            <Text style={styles.sectionTitle}>ITEMS</Text>

            <View style={styles.containerItems}>
                <TextInput
                    onChangeText={(val) => handleQuantity(setItemsQuant, setChoosedItems, val)}
                    inputMode='numeric'
                    style={styles.textTinyInput}
                    placeholder='How many items'
                />
                <FlatList
                    data={choosedItems}
                    keyExtractor={(item, index) => index.toString()}
                    style={styles.flatListItems}
                    horizontal={true}
                    renderItem={({ item, index }) => (
                        <View style={styles.containerItemsInner}>
                            <TextInput
                                key={index}
                                placeholder={`Item ${index + 1}`}
                                onChangeText={(val) => handleVectorChange(choosedItems, setChoosedItems, val, index)}
                                style={styles.textInput}
                            />
                        </View>
                    )}
                />
            </View>

            <Text style={styles.sectionTitle}>COST DETAILS</Text>

            <View style={styles.containerItems}>
                <TextInput
                    onChangeText={(val) => handleQuantity(setValuesQuant, setChoosedCostTitles, val)}
                    inputMode='numeric'
                    style={styles.textTinyInput}
                    placeholder='How many cost details'
                />

                {valuesQuant > 0 && !valuesStage ?
                    <Text style={styles.subtitleCost}>First of all, type the cost title(s):</Text>
                    : valuesStage ?
                        <Text style={styles.subtitleCost}>Now, type the cost value(s) and press Submit:</Text>
                        : null
                }

                <FlatList
                    data={choosedCostTitles}
                    keyExtractor={(item, index) => index.toString()}
                    style={styles.flatListItems}
                    horizontal={true}
                    renderItem={({ item, index }) => (
                        <>
                            {!valuesStage ?
                                <View style={styles.containerCostTitle}>
                                    <TextInput
                                        key={index}
                                        placeholder={`Title ${index + 1}`}
                                        onChangeText={(val) => handleVectorChange(choosedCostTitles, setChoosedCostTitles, val, index)}
                                        style={styles.textInput}
                                    />
                                </View> :
                                <View style={styles.containerCostValue}>
                                    <Text>{choosedCostTitles[index]}: </Text>
                                    <TextInput
                                        key={index}
                                        inputMode='numeric'
                                        style={styles.inputCostValue}
                                        placeholder={`Cost ${index + 1}`}
                                        onChangeText={(val) => handleVectorChange(choosedCostValues, setChoosedCostValues, val, index)}
                                    />
                                </View>
                            }
                        </>
                    )}
                />

                {valuesQuant > 0 && !valuesStage ?
                    <Pressable onPress={() => setValuesStage(true)} style={styles.buttonSubmit}>
                        <Text style={styles.textSubmit}>Next</Text>
                    </Pressable> : null}
            </View>

            <Pressable onPress={() => handleAddNewRealEstate()} style={styles.buttonSubmit}>
                <Text style={styles.textSubmit}>Add New Real Estate!</Text>
            </Pressable>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    containerAddNew: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        padding: 20,
    },
    containerTitles: {
        marginBottom: 20,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 25,
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
    },
    cameraPlaceholder: {
        width: 120,
        height: 120,
        alignSelf: 'center',
        marginVertical: 20,
    },
    imageList: {
        marginLeft: 20,
        marginVertical: 10,
    },
    realEstateImage: {
        width: 270,
        height: 130,
        marginRight: 10,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    inputContainer: {
        marginVertical: 20,
    },
    textInput: {
        padding: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    containerTiny: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    textTinyInput: {
        flex: 1,
        marginHorizontal: 5,
        padding: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        backgroundColor: '#fff',
    },
    containerItems: {
        marginBottom: 20,
        padding: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        backgroundColor: '#fff',
    },
    flatListItems: {
        marginVertical: 10,
    },
    containerItemsInner: {
        marginBottom: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        backgroundColor: '#fff',
    },
    subtitleCost: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 10,
    },
    containerCostTitle: {
        marginBottom: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        backgroundColor: '#fff',
    },
    containerCostValue: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        backgroundColor: '#fff',
    },
    inputCostValue: {
        flex: 1,
        padding: 10,
        marginLeft: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    buttonSubmit: {
        padding: 15,
        backgroundColor: '#ffeb3b',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 30,
    },
    textSubmit: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    pickerSelect: {
        inputIOS: {
            padding: 15,
            borderWidth: 1,
            borderColor: '#ddd',
            borderRadius: 10,
            backgroundColor: '#fff',
            marginVertical: 10,
        },
        inputAndroid: {
            padding: 15,
            borderWidth: 1,
            borderColor: '#ddd',
            borderRadius: 10,
            backgroundColor: '#fff',
            marginVertical: 10,
        },
        placeholder: {
            color: '#999',
        },
    },
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        padding: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        backgroundColor: '#fff',
        marginVertical: 10,
    },
    inputAndroid: {
        padding: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        backgroundColor: '#fff',
        marginVertical: 10,
    },
    placeholder: {
        color: '#999',
    },
});