import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React, { useState } from 'react'

import Header from '../../components/Home/Header';
import Slide from '../../components/Home/Slide';
import Category from '../../components/Home/Category';
import PopularRealEstateList from '../../components/Home/PopularRealEstateList';

export default function Home() { //Home page

    const [refreshing, setRefreshing] = useState(false);

    return (
        <ScrollView>
            <Header />
            <Slide />
            <Category />
            <PopularRealEstateList />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    title:{
        fontSize: 40,
        fontFamily: 'SpaceMono'
    }
});