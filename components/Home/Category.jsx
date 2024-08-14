import { StyleSheet, Text, View, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors } from '../../constants/Colors'
import { collection, query, getDocs } from 'firebase/firestore'
import { firestore } from '../../configs/firebase'
import CategoryItem from './CategoryItem'
import { useRouter } from 'expo-router'

export default function Category() {

    const router = useRouter();

    const [categoryList, setCategoryList] = useState([]);

    useEffect(() => {
        getCategory();
    }, [])

    const getCategory = async () => {
        setCategoryList([])
        const queryFirestore = query(collection(firestore, 'category-home'));
        const querySnapshot = await getDocs(queryFirestore);

        querySnapshot.forEach((doc) => {
            setCategoryList(prev => [...prev,doc.data()]);
        })
    }

    return (
        <View>

            <View style={styles.containerTitle}>
                <Text style={styles.title}>Category</Text>
            </View>

            <FlatList 
                data={categoryList}
                horizontal={true}
                style={{marginLeft: 20}}
                showsHorizontalScrollIndicator={false}
                renderItem={({item, index}) => (
                    <CategoryItem 
                        category={item} 
                        key={index} 
                        onCategoryPress={(category) => router.push('/realestatelist/'+category.name)}
                    />
                )}
            />

        </View>
    )
}

const styles = StyleSheet.create({
    title:{
        fontSize: 20,
        fontFamily: 'SpaceMono'
    },
    titleViewAll:{
        color: Colors.PRIMARY_BOTTOM_TABS,
        fontFamily: 'SpaceMono'
    },
    containerTitle:{
        padding: 20,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10
    },
})