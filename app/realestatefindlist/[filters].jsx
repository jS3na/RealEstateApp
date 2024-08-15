import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router';

export default function RealEstateFind() {

    const { filters } = useLocalSearchParams();

    return (
        <View>
            <Text>{filters}</Text>
        </View>
    )
}

const styles = StyleSheet.create({})