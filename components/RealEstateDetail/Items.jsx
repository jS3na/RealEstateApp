import { StyleSheet, Text, View, FlatList } from 'react-native';
import React from 'react';
import { FontAwesome } from '@expo/vector-icons';

export default function Items({ data }) {
    return (
        <>
            <Text style={styles.itemsSectionTitle}>Items Included:</Text>

            <FlatList
                data={data}
                scrollEnabled={false}
                style={styles.list}
                renderItem={({ item, index }) => (
                    <View style={styles.itemContainer} key={index}>
                        <FontAwesome name="check" size={20} color="#4caf50" />
                        <Text style={styles.itemText}>{item}</Text>
                    </View>
                )}
                keyExtractor={(item, index) => index.toString()}
            />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        marginVertical: 15,
    },
    itemsSectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        textAlign: 'center',
    },
    list: {
        marginTop: 10,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
        paddingHorizontal: 10,
    },
    itemText: {
        fontSize: 16,
        color: '#333',
        marginLeft: 10,
    },
});
