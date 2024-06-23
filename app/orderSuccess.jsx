import { Button, ButtonText, Center, HStack, Heading, Image, KeyboardAvoidingView, SafeAreaView, ScrollView, Text, VStack, View } from '@gluestack-ui/themed';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Keyboard, Platform, Pressable } from 'react-native';
import tw from "twrnc";
import Loading from '../components/Loading';
import useSetDocument from '../hooks/useSetDocument';
import fetchDoc from '../scripts/fetchDoc';
import useCheckSignedIn from '../hooks/useCheckSignedIn'

const orderSuccess = () => {
    const user = useCheckSignedIn()
    const UID = user?.uid
    const [userData, setUserData] = useState({})

    const [isLoading, setIsLoading] = useState(false)
    const { cart } = userData || {}
    const { lineItems, total } = cart || {}

    console.log(UID)
    console.log(userData)


    useEffect(() => {
        const run = async () => {
            setIsLoading(true)
            setUserData(await fetchDoc('Users', UID))
            useSetDocument('Users', UID, { cart: { lineItems: {}, total: 0 } })
            setIsLoading(false)
        }
        if (UID) run()
    }, [UID])


    return (
        <Pressable style={tw`h-full bg-green-700`} onPress={() => { (Platform.OS != "web") ? Keyboard.dismiss() : null }}>

            <SafeAreaView>
                {isLoading && <Loading />}
                <Center style={tw` relative h-full`}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} >

                        <Center>
                            <Heading size='xl'>Order Completed!</Heading>

                        </Center>
                        <ScrollView style={tw`${Platform.OS != 'web' ? 'w-96' : 'w-96'} h-96 my-2 rounded-lg bg-yellow-500 p-4`}>
                            <HStack style={tw`justify-center items-center`}>
                                {Object.values(lineItems || {})?.map(item => {
                                    return (
                                        <VStack style={tw`w-24 h-50 P-2 overflow-hidden items-center justify-center`}>
                                            <Image alt={item.name} style={tw`rounded-full mb-1 border-2 border-green-700 text-black`} source={{ uri: item.images[0] }} />
                                            <Text style={tw`font-semibold text-black text-center h-14`}>{item.name}</Text>
                                            <Text style={tw` text-black `}>${item.price}</Text>
                                            <Text style={tw` text-black `}>QTY:{item.Qty}</Text>
                                        </VStack>
                                    )
                                })}
                            </HStack>
                        </ScrollView>
                        <View>
                            <Text style={tw`font-bold text-white text-center`}>Total: ${total}</Text>
                        </View>
                        <Button onPress={() => { router.push('/') }} style={tw`bg-yellow-500 border-2 border-black`}>
                            <ButtonText>Return Home</ButtonText>
                        </Button>
                    </KeyboardAvoidingView>
                </Center>
            </SafeAreaView>
        </Pressable>
    )
}

export default orderSuccess