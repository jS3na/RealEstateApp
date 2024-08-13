import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import Header from '../../components/Home/Header';

export default function Home() {
    return (
        <View>
            <Header />
        </View>
    )
}

const styles = StyleSheet.create({
    title:{
        fontSize: 40,
        fontFamily: 'SpaceMono'
    }
});