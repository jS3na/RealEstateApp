import { StyleSheet, Text, View, FlatList } from 'react-native'
import React from 'react'

export default function Values({ valuesMap }) {

    const costDetailsArray = valuesMap ? Object.entries(valuesMap) : [];

    const totalCost = costDetailsArray.length > 0 ? Object.values(valuesMap).reduce((sum, value) => sum + value, 0) : 0;
    const formattedTotalCost = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2
    }).format(totalCost);

    const CostDetailItem = ({ title, value }) => (
        <View style={styles.costDetailsContainer}>
            <Text style={styles.costDetailText}>{title}: R$ {value}</Text>
        </View>
    );

    return (
        <>

            <Text style={styles.itemsSectionTitle}>Valores:</Text>

            <FlatList
                data={costDetailsArray}
                scrollEnabled={false}
                style={{ alignSelf: 'flex-start' }}
                keyExtractor={([key]) => key}
                renderItem={({ item }) => (
                    <CostDetailItem title={item[0]} value={item[1]} />
                )}
            />

            <Text style={styles.totalValue}>Total: {formattedTotalCost}</Text>

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
    costDetailsContainer: {
        flexDirection: 'row',
        alignSelf: 'flex-start',
        marginLeft: 40,
    },
    costDetailText: {
        marginBottom: 10,
        fontSize: 15
    },
    totalValue:{
        fontSize: 18,
        textAlign: 'center',
        fontWeight: 'bold',
    }
})