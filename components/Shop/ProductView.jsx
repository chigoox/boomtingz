import { Button, ButtonText, CloseIcon, HStack, Heading, Icon, Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ScrollView, VStack } from '@gluestack-ui/themed'
import React, { useEffect, useState } from 'react'
import tw from 'twrnc'
import CarouselStack from '../Carousel'
import { Text } from '@gluestack-ui/themed'
import ItemQTYButton from './ItemQTYButton'
import { View } from 'react-native'
import { useCartContext } from '../../StateManger/CartConext'


export const ProductView = ({ product, showProductView, setShowProductView, refDom }) => {

    const { dispatch } = useCartContext()
    const name = product?.name
    const price = product?.metadata?.price
    const images = product?.images
    const desc = product.description



    const [itemToCheckOut, setItemToCheckOut] = useState({})

    useEffect(() => { setItemToCheckOut({ priceID: product?.default_price, Qty: 0, images: images, name: name, price: price }) }, [product])

    const canAddToCart = () => {
        return (itemToCheckOut.inventory >= 1) ? true : true
        //message.error('Out of stock', 5)

    }

    const addToCart = () => {
        //console.log(itemToCheckOut.Qty)
        if (itemToCheckOut.priceID && itemToCheckOut.Qty > 0 && canAddToCart()) dispatch({ type: "ADD_TO_CART", value: itemToCheckOut })
    }

    return (
        <Modal
            size='lg'
            bgColor='$black'
            backgroundColor='$black'
            style={tw`bg-black`}
            isOpen={showProductView}
            onClose={() => {
                setShowProductView(false)
            }}
            finalFocusRef={refDom}
        >
            <ModalBackdrop />
            <ModalContent>
                <ModalHeader>
                    <Heading style={tw``} size="lg">
                        <VStack>
                            <Text style={tw`text-3xl font-bold`}>${price}</Text>
                            <Text style={tw`font-bold text-xl`}>{name}</Text>
                        </VStack>
                    </Heading>
                    <ModalCloseButton>
                        <Icon as={CloseIcon} />
                    </ModalCloseButton>
                </ModalHeader>
                <ModalBody>
                    <ScrollView style={tw`h-120`}>
                        <CarouselStack
                            slides={images}
                        />
                        <View>
                            <Text style={tw`font-bold border-b my-2`}>Description</Text>
                            <Text>{desc}</Text>
                        </View>

                    </ScrollView>
                </ModalBody>
                <ModalFooter style={tw`border border-white rounded-b-lg  bg-black`}>
                    <HStack w={'$full'} space='md' alignItems='center' justifyContent='space-around'>
                        <Button
                            variant="outline"
                            size="sm"
                            action="secondary"
                            mr="$3"
                            onPress={() => {
                                setShowProductView(false)
                            }}
                        >
                            <ButtonText style={tw`text-white`}>Cancel</ButtonText>
                        </Button>
                        <VStack space='md' >
                            <ItemQTYButton state={itemToCheckOut} setState={setItemToCheckOut} />
                            <Button
                                size="sm"
                                action="positive"
                                borderWidth="$0"
                                style={tw`relative`}
                                onPress={async () => {
                                    addToCart()
                                    setShowProductView(false)
                                }}
                            >
                                <ButtonText style={tw``}>Add to cart</ButtonText>
                            </Button>
                        </VStack>
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )

}

export default ProductView