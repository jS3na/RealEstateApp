import { FlatList, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from 'expo-router'
import * as ImagePicker from 'expo-image-picker';

export default function AddRealEstate() {

    const navigation = useNavigation();

    const [images, setImages] = useState([]);

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: "Add New Real Estate"
        });
    }, []);


    const handleImagePicker = async () => {
        setImages([]);
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
            allowsMultipleSelection: true
        });

        console.log(result);

        if (!result.canceled) {
            setImages(prev => [
                ...prev,
                ...result.assets.map(asset => asset.uri)
            ]);
        }
    }

    console.log(images)

    return (
        <View style={styles.containerAddNew}>

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
                    style={{ marginLeft: 20 }}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <Image style={styles.realEstateImage} source={{ uri: item }} />
                    )}
                    keyExtractor={(item, index) => index.toString()}
                />
            }

            <View>
                <TextInput placeholder='Name'/>
            </View>

            <View>
                <TextInput placeholder='About'/>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    containerAddNew: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20,
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
        width: 370,
        height: 230,
        marginRight: 20,
        marginVertical: 20,
        borderRadius: 20,
    },
})