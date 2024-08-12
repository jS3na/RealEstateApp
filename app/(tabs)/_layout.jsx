import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '../../constants/Colors'

export default function TabLayout() {
    return (
        <Tabs screenOptions={{ headerShown:false, tabBarActiveTintColor: Colors.PRIMARY }} >
            <Tabs.Screen 
                name="Home"
                options={{
                    tabBarIcon: ({color}) => <AntDesign name="home" size={24} color="black" />
                }}    
            />
            
            <Tabs.Screen 
                name="Explore"
                options={{
                    tabBarIcon: ({color}) => <AntDesign name="search1" size={24} color="black" />
                }}    
            />

            <Tabs.Screen 
            name="Profile"
            options={{
                tabBarIcon: ({color}) => <Ionicons name="person-outline" size={24} color="black" />
            }}    
        />
        </Tabs>
    )
}