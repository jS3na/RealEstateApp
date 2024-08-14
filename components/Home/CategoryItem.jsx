import { StyleSheet, Text, View, Image, Pressable } from 'react-native'
import React from 'react'

export default function CategoryItem({category, onCategoryPress}) {
    return (
        <Pressable onPress={() => onCategoryPress(category)}>
            <View style={styles.containerCategory}>
                <Image style={styles.imageCategory} source={{uri: category.icon}}/>
                <Text>{category.name}</Text>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    imageCategory:{
        width: 40,
        height: 40
    },
    containerCategory:{
        padding: 10,
        borderRadius: 50,
        marginRight: 35,
        justifyContent: 'center',
        alignItems: 'center'
    }
})