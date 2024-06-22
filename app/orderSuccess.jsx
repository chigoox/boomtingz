import { Button, Center, Heading, KeyboardAvoidingView, ScrollView, Text, VStack } from '@gluestack-ui/themed'
import React, { useEffect, useState } from 'react'
import { Platform, Pressable } from 'react-native'
import Loading from '../components/Loading'
import tw from "twrnc";
import { ButtonText } from '@gluestack-ui/themed';
import { router, useLocalSearchParams } from 'expo-router';
import useSetDocument from '../hooks/useSetDocument';
import useFetchData from '../hooks/useFetchData';
import ShopItem from '../components/Shop/ShopItem';
import fetchDoc from '../scripts/fetchDoc';
import { Image } from '@gluestack-ui/themed';

const orderSuccess = () => {
    const { UID } = useLocalSearchParams() || {}
    const [userData, setUserData] = useState({})

    const [isLoading, setIsLoading] = useState(false)
    const { cart } = userData || {}
    const { lineItems, total } = cart || {}

    console.log(userData)
    useEffect(() => {
        const run = async () => {
            setUserData(await fetchDoc('Users', UID))
            useSetDocument('Users', UID, { cart: { lineItems: {}, total: 0 } })
        }
        run()
    }, [])


    return (
        <Pressable style={tw`h-full`} onPress={() => { (Platform.OS != "web") ? Keyboard.dismiss() : null }}>

            {isLoading && <Loading />}
            <Center style={tw`bg-green-700 relative h-full`}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'} >

                    <Center>
                        <Heading size='xl'>Order Completed!</Heading>

                    </Center>
                    <ScrollView style={tw`h-96 w-96 my-2 rounded-lg bg-yellow-500 p-4`}>
                        {Object.values(lineItems || {})?.map(item => {
                            return (
                                <VStack style={tw`w-24 overflow-hidden items-center justify-center`}>
                                    <Image style={tw`rounded-full text-black`} source={{ uri: item.images[0] }} />
                                    <Text style={tw`text-center`}>{item.name}</Text>
                                    <Text style={tw``}>{item.price}</Text>
                                    <Text style={tw``}>{item.Qty}</Text>
                                </VStack>
                            )
                        })}
                    </ScrollView>
                    <Button onPress={() => router.push('/')} style={tw`bg-yellow-500 border-2 border-black`}>
                        <ButtonText>Return Home</ButtonText>
                    </Button>
                </KeyboardAvoidingView>
            </Center>
        </Pressable>
    )
}

export default orderSuccess