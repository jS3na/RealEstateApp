import { StyleSheet, Text, View, FlatList } from 'react-native';
import React from 'react';

export default function Values({ valuesMap }) {
    const costDetailsArray = valuesMap ? Object.entries(valuesMap) : [];

    const totalCost = costDetailsArray.length > 0 
        ? Object.values(valuesMap).reduce((sum, value) => sum + value, 0) 
        : 0;
    const formattedTotalCost = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    }).format(totalCost);

    const CostDetailItem = ({ title, value }) => (
        <View style={styles.costDetailContainer}>
            <Text style={styles.costDetailText}>{title}:</Text>
            <Text style={styles.costDetailValue}>  ${value.toFixed(2)}</Text>
        </View>
    );

    return (
        <>
            <Text style={styles.itemsSectionTitle}>Values:</Text>

            <FlatList
                data={costDetailsArray}
                scrollEnabled={false}
                style={styles.list}
                keyExtractor={([key]) => key}
                renderItem={({ item }) => (
                    <CostDetailItem title={item[0]} value={item[1]} />
                )}
            />

            <Text style={styles.totalValue}>Total: {formattedTotalCost}</Text>
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
        marginVertical: 15,
        textAlign: 'center',
    },
    list: {
        marginBottom: 10,
    },
    costDetailContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    costDetailText: {
        fontSize: 16,
        color: '#333',
    },
    costDetailValue: {
        fontSize: 16,
        color: '#555',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginVertical: 15,
    },
});
