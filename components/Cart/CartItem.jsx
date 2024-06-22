import { View, Text } from 'react-native'
import React, { memo } from 'react'
import ItemQTYButton from '../Shop/ItemQTYButton'
import { useCartContext } from '../../StateManger/CartConext'
import { Card, HStack } from '@gluestack-ui/themed'
import { Image } from '@gluestack-ui/themed'
import { Button } from '@gluestack-ui/themed'
import { getRandNum } from '../../constants/Utils'
import tw from "twrnc";
import { Ionicons } from '@expo/vector-icons'

const CartItem = memo(({ item }) => {
    const { dispatch } = useCartContext()
    const Trash2Icon = <Ionicons name='trash' color={'red'} />

    const RemoveFromCart = (itemRemove) => {
        dispatch({ type: "REMOVE_FROM_CART", value: itemRemove })
    }
    return (
        <View key={item.priceId + String(getRandNum())} style={tw`h-36 my-2 border p-2 border-dashed rounded   border-green-700  relative`}>
            <HStack style={tw`gap-2 items-center justify-center  relative h-1/2 top-4 p-2`}>
                <Card style={tw`w-20 h-24 p-0 border border-gray-700 border-dashed relative bg-black overflow-hidden`}>
                    <Image style={tw`w-20 h-24`} source={{ uri: item.images ? item.images[0] : '' }} alt="" />

                </Card>
                <View style={tw`p-1  w-1/3`}>
                    <Text style={tw`text-white h-8`}>{item.name?.substr(0, 20)}{item?.name?.length > 20 ? '...' : ''}</Text>
                    {item?.variant && <Text style={tw`font-light text-gray-400 text-xs h-4 overflow-hidden`}>{item?.variant}</Text>}
                    <Text style={tw`font-bold  text-white`}>{String(item?.price).includes('$') ? '' : '$'}{item?.price || 200}</Text>
                </View>


                <View style={tw`text-black  w-1/3`}>
                    <ItemQTYButton size={'sm'} product={item} forCart={true} />
                </View>
            </HStack>
            <Button onPress={() => { RemoveFromCart(item) }} style={tw`h-6 mb-2  rounded-t-md font-semibold w-24  text-red-500 bg-gray-600 m-auto bottom-0 `}>
                {Trash2Icon}
            </Button>
        </View>
    )
})

export default CartItem