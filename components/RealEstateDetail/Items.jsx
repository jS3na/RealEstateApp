import { StyleSheet, Text, View, FlatList } from 'react-native'
import React from 'react'

import { FontAwesome } from '@expo/vector-icons'

export default function Items({ data }) {
    return (

        <>

            <Text style={styles.itemsSectionTitle}>Itens Inclusos:</Text>

            <FlatList
                data={data}
                scrollEnabled={false}
                style={{ alignSelf: 'flex-start' }}
                renderItem={({ item, index }) => (
                    <View style={styles.itemContainer} key={index}>
                        <FontAwesome name="check" size={24} color="black" />
                        <Text>{item}</Text>
                    </View>
                )}
                keyExtractor={(item, index) => index.toString()}
            />

        </>

    )
}

const styles = StyleSheet.create({
    itemsSectionTitle: {
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold',
        margin: 20
    },
    itemContainer: {
        flexDirection: 'row',
        gap: 10,
        alignSelf: 'flex-start',
        marginLeft: 40
    },
})