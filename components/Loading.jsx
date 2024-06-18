import { Center, Spinner, Text } from '@gluestack-ui/themed'
import React, { useState } from 'react'
import { Platform } from 'react-native'
import tw from 'twrnc'

function Loading({ colored }) {
    const [color, setColor] = useState('$green500')
    if (colored)
        setTimeout(() => {
            setColor(oldColor => {
                return (oldColor == '$red500') ? '$yellow500' : (oldColor == '$yellow500') ? '$green500' : '$red500'

            })
        }, 700);
    return (
        <Center style={tw`h-full w-full absolute top-0 left-0  bg-black overflow-hidden z-999 bg-opacity-75`}>
            <Spinner color={color} style={tw`m-0 text-red-300 p-2 border-dashed rounded border-green-500 border`} size={'large'} />
            <Text style={tw`text-yellow-500 mt-2 text-center w-full text-3xl font-bold`}>Loading</Text>
        </Center>
    )
}

export default Loading