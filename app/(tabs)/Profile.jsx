import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import HeaderProfile from '../../components/Profile/HeaderProfile'
import { useUser } from '@clerk/clerk-expo';
import UserInfo from '../../components/Profile/UserInfo';
import ProfileMenuList from '../../components/Profile/ProfileMenuList';

export default function Profile() {

    const { user } = useUser();

    return (
        <View style={{backgroundColor: 'white', flex: 1}}>

            <HeaderProfile />
            <UserInfo />
            <ProfileMenuList />

        </View>
    )
}

const styles = StyleSheet.create({

})