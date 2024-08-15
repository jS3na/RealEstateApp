import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, getDocs, query } from 'firebase/firestore'
import { firestore } from '../../configs/firebase'
import { SelectList } from 'react-native-dropdown-select-list'
import { useRouter } from 'expo-router'

export default function Filters() {

    const router = useRouter(0);

    const [loading, setLoading] = useState(true);

    const [categories, setCategories] = useState([]);
    const [neighborhoods, setNeighborhoods] = useState([]);

    const [categorySelected, setCategorySelected] = useState("");
    const [neighborhoodSelected, setNeighborhoodSelected] = useState("");
    const [roomSelected, setRoomsSelected] = useState();
    const [valuesSelected, setValuesSelectef] = useState();

    const [filters, setFilters] = useState([])

    const roomsOptions = [
        { key: '1', value: '1' },
        { key: '2', value: '2' },
        { key: '3', value: '3' },
        { key: '4', value: '+ 3' }
    ];

    const valuesOptions = [
        { key: '1', value: '1.000' },
        { key: '2', value: '2.000' },
        { key: '3', value: '3.000' },
        { key: '4', value: '+ 4.000' }
    ];

    useEffect(() => {
        getFilters();
    }, [])

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
    }

    function Find(){
        setFilters([categorySelected, neighborhoodSelected, roomSelected, valuesSelected]);
        console.warn(filters)
        router.push('/realestatefindlist/' + filters)

    }

    return (
        <View>
            {loading ? (
                <ActivityIndicator size={60} style={{ margin: 30 }} />
            ) :

                <>
                    <Text>Filters</Text>

                    <SelectList
                        setSelected={(val) => setCategorySelected(val)}
                        data={categories}
                        save="value"
                        label="Categories"
                        search={false}
                    />

                    <SelectList
                        setSelected={(val) => setNeighborhoodSelected(val)}
                        data={neighborhoods}
                        save="value"
                        label="Neighborhoods"
                        search={false}
                    />

                    <SelectList
                        setSelected={(val) => setRoomsSelected(val)}
                        data={roomsOptions}
                        save="value"
                        label="Rooms"
                        search={false}
                    />

                    <SelectList
                        setSelected={(val) => setValuesSelectef(val)}
                        data={valuesOptions}
                        save="value"
                        label="Values"
                        search={false}
                    />

                    <Pressable onPress={() => Find()}>
                        <Text>Find</Text>
                    </Pressable>

                </>

            }

        </View>
    )
}

const styles = StyleSheet.create({})
