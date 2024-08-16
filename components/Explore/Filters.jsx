import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, getDocs, query } from 'firebase/firestore'
import { firestore } from '../../configs/firebase'
import { SelectList } from 'react-native-dropdown-select-list'
import { useRouter } from 'expo-router'

export default function Filters() {
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [neighborhoods, setNeighborhoods] = useState([]);
    const [categorySelected, setCategorySelected] = useState("Studio");
    const [neighborhoodSelected, setNeighborhoodSelected] = useState("Centro");
    const [roomSelected, setRoomsSelected] = useState(1);
    const [filters, setFilters] = useState([]);

    const roomsOptions = [
        { key: '1', value: 1 },
        { key: '2', value: 2 },
        { key: '3', value: 3 },
        { key: '4', value: 4 }
    ];

    useEffect(() => {
        getFilters();
    }, []);

    const getFilters = async () => {
        const queryFirestore = query(collection(firestore, 'real-estate'));
        const querySnapshot = await getDocs(queryFirestore);

        const formattedCategories = [];
        const formattedNeighborhoods = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.category) {
                formattedCategories.push({ key: doc.id, value: data.category });
            }
            if (data.neighborhood) {
                formattedNeighborhoods.push({ key: doc.id, value: data.neighborhood });
            }
        });

        setCategories(formattedCategories);
        setNeighborhoods(formattedNeighborhoods);
        setLoading(false);
    };

    useEffect(() => {
        if (filters.length > 0) {
            router.push('/realestatefindlist/' + filters);
        }
    }, [filters]);

    const Find = async () => {
        setFilters([categorySelected, neighborhoodSelected, roomSelected]);
    };

    const SelectListCard = ({ setSelected, data, placeholder }) => {
        return (
            <SelectList
                setSelected={(val) => setSelected(val)}
                data={data}
                style={styles.dropDownMenu}
                save="value"
                placeholder={placeholder}
                search={false}
                boxStyles={styles.box} 
                inputStyles={styles.input}
                dropdownStyles={styles.dropdown}
            />
        );
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

                    <SelectListCard
                        setSelected={setCategorySelected}
                        data={categories}
                        placeholder="Categories"
                    />

                    <SelectListCard
                        setSelected={setNeighborhoodSelected}
                        data={neighborhoods}
                        placeholder="Neighborhoods"
                    />

                    <SelectListCard
                        setSelected={setRoomsSelected}
                        data={roomsOptions}
                        placeholder="Rooms"
                    />

                    <Pressable style={styles.findButton} onPress={Find}>
                        <Text>Discover</Text>
                    </Pressable>
                </View>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    containerDropDown: {
        display: 'flex',
        justifyContent: 'start',
        backgroundColor: 'white',
        height: '100%',
        padding: 20
    },
    containerTitle: {
        margin: 50,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10
    },
    title:{
        fontFamily: 'SpaceMono',
        fontSize: 20,
        textAlign: 'center'
    },
    dreams:{
        fontFamily: 'SpaceMono',
        fontSize: 30,
        textAlign: 'center',
        color: 'orange'
    },
    box: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        backgroundColor: '#f9f9f9',
        margin: 10
    },
    input: {
        fontSize: 16,
        color: '#333',
    },
    dropdown: {
        backgroundColor: '#fff',
        borderRadius: 5,
    },
    findButton: {
        backgroundColor: 'lightyellow',
        borderWidth: 1,
        padding: 15,
        borderRadius: 20,
        borderColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10
    }
});