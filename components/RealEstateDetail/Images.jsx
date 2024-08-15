import { StyleSheet, Text, View, FlatList, Image } from 'react-native'
import React from 'react'

export default function Images({ data }) {
    return (
        <>
            <FlatList
                data={data}
                horizontal={true}
                style={{ marginLeft: 20 }}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                    <Image style={styles.realEstateImage} source={{ uri: item }} />
                )}
                keyExtractor={(item, index) => index.toString()}
            />
        </>
    )
}

const styles = StyleSheet.create({
    realEstateImage: {
        width: 370,
        height: 230,
        margin: 20,
        borderRadius: 20,
    },
})