import { AddIcon, Button, ButtonIcon, Center, HStack, RemoveIcon } from '@gluestack-ui/themed'
import React, { useEffect, useState } from 'react'
import { TextInput } from 'react-native'
import tw from 'twrnc'
import { useCartContext } from '../../StateManger/CartConext'

const ItemQTYButton = ({ size = 'md', product, setState, forCart }) => {
    const [QTY, setQTY] = useState(product?.Qty || 0)
    const { dispatch } = useCartContext()
    const controlQTY = (action = 'add', count = 1) => {
        if (action == 'add') setQTY(prevState => prevState < 99 ? prevState + count : prevState)
        if (action == 'sub') setQTY(prevState => prevState > 0 ? prevState - count : prevState)
        if (action == 'set') setQTY(event.target.value)
        if (product) {
            const currentItemInfo = { images: product.images, name: product.name, price: (product.metadata?.price || product.price), priceID: product.priceID }
            if (action == 'add') dispatch({ type: "ADD_TO_CART", value: { ...currentItemInfo, Qty: 1 } })
            if (action == 'sub') dispatch({ type: "SUB_FROM_CART", value: { ...currentItemInfo, Qty: 1 } })
            if (action == 'set') dispatch({ type: "SET_CART", value: { ...currentItemInfo, Qty: count } })
        }

    }
    useEffect(() => {
        if (setState) setState(prev => ({ ...prev, Qty: QTY }))
        if (product?.Qty == 0 && product && forCart) {
            //setQTY()
            dispatch({ type: "REMOVE_FROM_CART", value: product })
        }
    }, [QTY, product?.Qty])

    return (
        <HStack style={tw``}>
            <Button onPress={() => controlQTY('sub')} style={tw`w-6 ${size == 'sm' ? 'p-4' : ''}  bg-green-700 rounded-none rounded-l-full`}>
                <Center>
                    <ButtonIcon as={RemoveIcon} />
                </Center>
            </Button>
            <TextInput color='white' value={QTY} onChangeText={(v) => controlQTY('set', v)} style={tw`text-white text-center w-13`} type='tel' />
            <Button onPress={() => controlQTY()} style={tw`w-6 ${size == 'sm' ? 'p-4' : ''}  bg-green-700 rounded-none rounded-r-full`}>
                <Center>
                    <ButtonIcon as={AddIcon} />
                </Center>
            </Button>
        </HStack>
    )
}

export default ItemQTYButton