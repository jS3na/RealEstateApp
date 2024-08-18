import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import { firestore } from '../../configs/firebase';
import RNPickerSelect from 'react-native-picker-select';
import { useRouter } from 'expo-router';

export default function Filters() {
    const router = useRouter();

    const [categoriesList, setCategoriesList] = useState([]);
    const [neighborhoodsList, setNeighborhoodsList] = useState([]);

    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [neighborhoods, setNeighborhoods] = useState([]);
    const [categorySelected, setCategorySelected] = useState();
    const [neighborhoodSelected, setNeighborhoodSelected] = useState();
    const [roomSelected, setRoomsSelected] = useState(1);
    const [filters, setFilters] = useState([]);

    const roomsOptions = [
        { value: 1, label: '1' },
        { value: 2, label: '2' },
        { value: 3, label: '3' },
        { value: 4, label: '4' }
    ];

    useEffect(() => {
        getFilters();
        getCategories();
    }, []);

    const getFilters = async () => {
        setNeighborhoodsList([]);
        const queryFirestore = query(collection(firestore, 'real-estate'));
        const querySnapshot = await getDocs(queryFirestore);

        const formattedNeighborhoods = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.neighborhood) {
                formattedNeighborhoods.push({ value: data.neighborhood, label: data.neighborhood });
            }
        });

        setNeighborhoodsList(formattedNeighborhoods);
        setLoading(false);
    };

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

    useEffect(() => {
        if (filters.length > 0) {
            router.push('/realestatefindlist/' + filters);
        }
    }, [filters]);

    const Find = async () => {
        setFilters([categorySelected, neighborhoodSelected, roomSelected]);
    };

    return (
        <>
            {loading ? (
                <ActivityIndicator size={60} style={{ margin: 30 }} />
            ) : (
                <View style={styles.containerDropDown}>
                    <View style={styles.containerTitle}>
                        <Text style={styles.title}>Find the Property of Your</Text>
                        <Text style={styles.dreams}>DREAMS</Text>
                        <Text style={styles.title}>Now!</Text>
                    </View>

                    <RNPickerSelect
                        onValueChange={(value) => setCategorySelected(value)}
                        items={categoriesList}
                        placeholder={{
                            label: 'Select the Category',
                            value: null,
                            color: 'gray',
                        }}
                    />

                    <RNPickerSelect
                        onValueChange={(value) => setNeighborhoodSelected(value)}
                        items={neighborhoodsList}
                        placeholder={{
                            label: 'Select the neighborhoods',
                            value: null,
                            color: 'gray',
                        }}
                    />

                    <RNPickerSelect
                        onValueChange={(value) => setRoomsSelected(value)}
                        items={roomsOptions}
                        placeholder={{
                            label: 'Select the Rooms',
                            value: null,
                            color: 'gray',
                        }}
                    />

                    <Pressable style={styles.findButton} onPress={Find}>
                        <Text style={styles.findButtonText}>Discover</Text>
                    </Pressable>
                </View>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    containerDropDown: {
        display: 'flex',
        justifyContent: 'flex-start',
        height: '100%',
        padding: 20,
        paddingTop: 80,
    },
    containerTitle: {
        marginBottom: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontFamily: 'SpaceMono',
        fontSize: 20,
        textAlign: 'center',
        color: '#333',
    },
    dreams: {
        fontFamily: 'SpaceMono',
        fontSize: 32,
        textAlign: 'center',
        color: '#f7b801',
        fontWeight: 'bold',
    },
    box: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 15,
        backgroundColor: '#f9f9f9',
        marginVertical: 10,
        elevation: 2,
    },
    input: {
        fontSize: 16,
        color: '#333',
    },
    dropdown: {
        backgroundColor: '#fff',
        borderRadius: 10,
    },
    findButton: {
        backgroundColor: '#f7b801',
        borderRadius: 25,
        paddingVertical: 15,
        marginTop: 50,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 10,
    },
    findButtonText: {
        fontFamily: 'SpaceMono',
        fontSize: 18,
        color: '#fff',
    },
});
