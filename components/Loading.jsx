import { Text } from '@gluestack-ui/themed'
import React from 'react'
import tw from 'twrnc'

function Loading({ contain }) {
    return (
        <View className={tw`${contain ? 'h-full w-full absolute' : 'h-screen w-screen fixed'} top-0 left-0  bg-black overflow-hidden z-[9999999999] center-col bg-opacity-75`}>

            <Text className='text-white mt-8 text-center w-full text-3xl font-bold'>Loading</Text>
        </View>
    )
}

export default Loading