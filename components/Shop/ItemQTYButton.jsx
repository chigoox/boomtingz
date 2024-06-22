import { AddIcon, Button, ButtonIcon, Center, HStack, Input, InputField, RemoveIcon } from '@gluestack-ui/themed'
import React, { useEffect, useRef, useState } from 'react'
import { Platform, TextInput } from 'react-native'
import tw from 'twrnc'
import { useCartContext } from '../../StateManger/CartConext'
import { Text } from 'react-native'

const ItemQTYButton = ({ size = 'md', product, setState, forCart }) => {
    const [QTY, setQTY] = useState(product?.Qty || 1)
    const { dispatch } = useCartContext()
    const controlQTY = (action = 'add', count = 1) => {
        if (action == 'add') setQTY(prevState => prevState < 99 ? prevState + count : prevState)
        if (action == 'sub') setQTY(prevState => prevState > 0 ? prevState - count : prevState)
        if (action == 'set') setQTY(Number(count))
        if (product) {
            const currentItemInfo = { images: product.images, name: product.name, price: (product.metadata?.price || product.price), priceID: product.priceID }
            if (action == 'add') dispatch({ type: "ADD_TO_CART", value: { ...currentItemInfo, Qty: 1 } })
            if (action == 'sub') dispatch({ type: "SUB_FROM_CART", value: { ...currentItemInfo, Qty: 1 } })
            if (action == 'set') dispatch({ type: "SET_CART", value: { ...currentItemInfo, Qty: Number(count) } })
        }

    }
    useEffect(() => {
        if (setState) setState(prev => ({ ...prev, Qty: QTY }))
        if (product?.Qty == 0 && product && forCart) {
            //setQTY()
            dispatch({ type: "REMOVE_FROM_CART", value: product })
        }
    }, [QTY, product?.Qty])

    const text = useRef()

    return (
        <HStack style={tw``}>
            <Button onPress={() => controlQTY('sub')} style={tw`w-6 ${size == 'sm' ? 'p-4' : ''}  bg-green-700 rounded-none rounded-l-full`}>
                <Center>
                    <ButtonIcon as={RemoveIcon} />
                </Center>
            </Button>
            <Input style={tw`w-12 rounded-none border-2 border-gray-900   relative`}>
                {Platform.OS != 'web' && <Text onPress={() => { 'text.current.focus()' }} style={tw`w-full bg-black text-white  absolute z-10 h-full text-xl text-center `}>{QTY}</Text>}
                <InputField ref={text} value={QTY || 0} maxLength={2} onChangeText={(v) => controlQTY('set', v)} style={tw`${Platform.OS != 'web' ? 'text-white' : 'text-black'} bg-white text-center `} type='text' />
            </Input>
            <Button onPress={() => controlQTY()} style={tw`w-6 ${size == 'sm' ? 'p-4' : ''}  bg-green-700 rounded-none rounded-r-full`}>
                <Center>
                    <ButtonIcon as={AddIcon} />
                </Center>
            </Button>
        </HStack>
    )
}

export default ItemQTYButton