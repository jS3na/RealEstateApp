import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

export default function Home() {
    return (
        <View>
            <Text style={styles.title}>Home</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    title:{
        fontSize: 40,
        fontFamily: 'SpaceMono'
    }
});