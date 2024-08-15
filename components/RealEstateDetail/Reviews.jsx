import { FlatList, Image, Pressable, StyleSheet, Text, TextInput, ToastAndroid, View } from 'react-native'
import React, { useState } from 'react'
import { Rating } from 'react-native-ratings'
import { arrayUnion, doc, updateDoc } from 'firebase/firestore'
import { firestore } from '../../configs/firebase'
import { useUser } from '@clerk/clerk-expo'

export default function Reviews({ data }) {

    const [rating, setRating] = useState(4);
    const [userReview, setUserReview] = useState();

    const { user } = useUser();

    const onReviewSubmit = async () => {

        const docRef = doc(firestore, 'real-estate', data?.id);
        await updateDoc(docRef, {
            reviews: arrayUnion({
                rating: rating,
                review: userReview,
                username: user?.fullName,
                userimage: user?.imageUrl
            })
        })

        ToastAndroid.show('Review Added Successfully!', ToastAndroid.BOTTOM)
    }

    return (
        <View style={styles.containerReviews}>
            <Text style={styles.titleReviews}>Reviews</Text>

            <View>

                <Rating
                    imageSize={25}
                    showRating={false}
                    startingValue={rating}
                    onFinishRating={(rating) => setRating(rating)}
                    style={{ padding: 10 }}
                />

                <TextInput onChangeText={(value) => setUserReview(value)} numberOfLines={4} style={styles.inputReview} placeholder='Write your comment!' />

                <Pressable disabled={!userReview} onPress={() => onReviewSubmit()} style={styles.buttonSubmit}>
                    <Text>Submit</Text>
                </Pressable>

            </View>

            <View>
                {data?.reviews?.map((item, index) => (
                    <View style={styles.containerReview}>
                        <Image style={styles.userImage} source={{ uri: item.userimage }} />
                        <View style={styles.containerTextReview}>
                            <Text style={styles.userName} key={index} >{item.username}</Text>
                            <Rating
                                imageSize={13}
                                showRating={false}
                                startingValue={item.rating}
                            />
                            <Text style={styles.userReview}>{item.review}</Text>
                        </View>
                    </View>
                ))}
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    containerReviews: {
        padding: 20,
        backgroundColor: 'white',
        width: '100%'
    },
    titleReviews: {
        fontWeight: 'bold',
        fontSize: 20,
        alignSelf: 'center',
        margin: 10
    },
    inputReview: {
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
        borderColor: 'gray',
        margin: 5,
        textAlignVertical: 'top'
    },
    buttonSubmit: {
        padding: 10,
        backgroundColor: 'lightyellow',
        borderWidth: 1,
        borderRadius: 10,
        alignItems: 'center',
        margin: 10
    },
    userImage: {
        width: 50,
        height: 50,
        borderRadius: 100
    },
    containerReview: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        borderWidth: 1,
        margin: 10,
        padding: 10,
        borderRadius: 15,
    },
    containerTextReview:{
        alignItems: 'flex-start',
        gap: 10,
        padding: 10
    },
    userName: {
        fontFamily: 'SpaceMono',
        fontSize: 20
    }
})