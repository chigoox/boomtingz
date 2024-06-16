import { AntDesign, Entypo } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';


export default function TabLayout() {

  return (
    <Tabs 
      screenOptions={{
        tabBarActiveTintColor: '#FFFF00',
        tabBarInactiveTintColor: '#ffffff',
        headerShown: false,
        tabBarStyle:{
          backgroundColor: 'black',
        }
      }} >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <AntDesign name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: 'Shop',
          tabBarIcon: ({ color, focused }) => (
           <Entypo name="shop" size={24} color={color} />
          ),
        }}
      />
       <Tabs.Screen
        name={"cart"}
        options={{
          title: 'Cart',
          tabBarIcon: ({ color, focused }) => (
           <Entypo name="shopping-cart" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
