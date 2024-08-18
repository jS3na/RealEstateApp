import { View, Text } from 'react-native'
import React from 'react'
import Header from '../../components/Home/Header'
import Filters from '../../components/Explore/Filters'

export default function Explore() { //Explore page
    return (
        <View>
            <Header />
            <Filters />
        </View>
    )
}