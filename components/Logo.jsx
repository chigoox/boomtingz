import { View, Text } from 'react-native'
import React from 'react'
import { Center, Heading } from '@gluestack-ui/themed'
import { Image } from '@gluestack-ui/themed'
import tw from 'twrnc'

const Logo = ({ size }) => {
    return (
        <Center style={tw`${size == 'sm' ? '' : ''}`}>
            <View style={tw` overflow-hidden relative bg-black ${size == 'sm' ? 'h-24 w-24' : 'h-36 w-36'} border-4 border-red-700  rounded-full`}>
                <View style={tw`bg-green-600 absolute top-0 h-full w-full z-10 bg-opacity-18`}>

                </View>
                <View style={tw`  ${size == 'sm' ? 'h-20 w-20' : 'h-26 w-26'} rounded-full p-2 border-2 border-green-700 border-dashed  m-auto`}>
                    <Image alt={'logo'} style={tw` ${size == 'sm' ? 'h-20 w-20' : 'h-26 w-26'} rounded-full  m-auto`} source={require('../assets/images/logo.png')} />

                </View>
            </View>
            <Heading h={'$8'} color='$white'>Boom Tingz</Heading>
        </Center>
    )
}

export default Logo