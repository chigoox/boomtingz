'use client'
import { useEffect, useState } from 'react';
import { getRandNum } from '../../constants/Utils';
import { Link } from 'expo-router';
import { ButtonText, Card, Center } from '@gluestack-ui/themed';
import tw from 'twrnc'
import { Image } from '@gluestack-ui/themed';
import { Button } from '@gluestack-ui/themed';
import { Text } from '@gluestack-ui/themed';
import { View } from '@gluestack-ui/themed';

function ShopItem({ shopItems, location = 'HotTools', onShopPage }) {
    const { name, images, metadata } = shopItems ? shopItems : { name: 'Item', images: [''] }
    const { price } = metadata || { price: 0 }
    const [productsLoaded, setProductsLoaded] = useState(false)
    const [ShowQuickView, setShowQuickView] = useState(false)
    // const stars = Array.apply(null, Array(rating))
    const awaitLoading = () => {
        setTimeout(() => {
            if (name) setProductsLoaded(true)
        }, getRandNum(500));
    }

    const toggleQuickView = () => {
        console.log(shopItems)
        if (ShowQuickView == false) return setShowQuickView(shopItems)
        setShowQuickView(false)
    }

    useEffect(() => {
        awaitLoading()
    }, [name])
    return (
        <View style={tw`h-64  border-white  flex-shrink-0 m-auto  w-40 md:h-64  md:w-64  my-2  border-[#474747] hover:border-white hover:font-extrabold    relative   overflow-hidden`}>
            {/* <ProductView
                showShopView={ShowQuickView}
                setShowShopView={setShowQuickView}
            /> */}
            <View >
                <Link style={tw`flex-col items-center justify-center`} href={`/Shop/${location}/${name?.replace(/\s/g, '')}`}>
                    <View isLoaded={productsLoaded} style={tw`w-auto h-auto rounded-xl bg-gray-400 `}>
                        <Card style={tw`h-40 w-40 border-4 relative rounded-xl overflow-hidden bg-white`}>
                            <Image source={{ uri: 'images[0]' }} style={tw`h-full w-full object-cover`} alt="" />
                            <Center style={tw` absolute bg-black  bg-opacity-50 hover:bg-opacity-0 h-full w-full `}>
                            </Center>
                        </Card>
                    </View>
                    <View style={tw`h-[30%] md:h-[20%] bg-opacity-75  bottom-0  w-full flex items-center flex-col p-2`}>
                        <View style={tw`w-full flex items-center justify-center gap-1`}>
                            <span style={tw`font-extralight text-sm`}>$</span><span style={tw`text-2xl font-semibold`}>
                                <View isLoaded={productsLoaded} style={tw`w-auto h-auto bg-gray-400`}>
                                    <Text color='white' style={tw`md:text-lg group-hover:bg-black text-white  w-60  p-1  text-center max-h-16 overflow-hidden md:max-h-20`}>{name?.substr(0, 50)}{name?.length > 50 ? '...' : ''}test</Text>
                                    <Text color='white'><View isLoaded={price} style={tw`rounded`}>{price || 'price'}</View></Text>
                                </View>
                            </span>
                        </View>

                    </View>
                </Link>
                <Button onPress={(event) => { toggleQuickView(event) }} style={tw`w-auto m-auto  font-bold `} >
                    <ButtonText>Add to cart</ButtonText>
                </Button>

                {/*  <View style='w-28 h-8 absolute rounded-full flex justify-end items-center p-2 top-[70%] right-4 bg-black bg-opacity-75'>
                {stars.map((star) => {
                    return (
                        <AiFillStar size={14} color='yellow' />
                    )
                })}


            </View> */}

            </View>


        </View>
    )
}

export default ShopItem