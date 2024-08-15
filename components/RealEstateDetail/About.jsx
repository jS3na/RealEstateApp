import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function About({ title, about }) {
    return (
        <View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.about}>{about}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    about: {
        fontSize: 15,
        padding: 10,
        textAlign: 'start',
        marginLeft: 10
    },
})