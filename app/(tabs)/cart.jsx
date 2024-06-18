
import useCheckSignedIn from '@/hooks/useCheckSignedIn';
import { AntDesign } from '@expo/vector-icons';
import { Center, HStack, SafeAreaView, ScrollView, Text, VStack, View } from "@gluestack-ui/themed";
import { useEffect, useState } from "react";
import tw from "twrnc";
import { useCartContext } from '../../StateManger/CartConext.jsx';
import CartItem from '../../components/Cart/CartItem.jsx';
import CheckoutScreen from '../../components/Cart/CheckoutScreen';
import Loading from '../../components/Loading.jsx';
import useSetDocument from '../../hooks/useSetDocument.js';

const AiOutlineClose = <AntDesign name='outline-close' />

function Cart() {
    const { state } = useCartContext()
    const { lineItems, total } = state

    const user = useCheckSignedIn()
    const UID = user?.uid

    const [isLoading, setIsLoading] = useState(false)

    const checkOutItems = Object.values(lineItems).map(item => ({ price: item.priceID, category: item.category, quantity: Number(item.Qty) }))



    //updates cart in database
    useEffect(() => {
        if (UID && state) useSetDocument('User', UID, state)
    }, [lineItems])




    return (
        <View h={'$full'} bgColor='$black'>
            {isLoading && <Loading />}
            <SafeAreaView h={'$full'}>
                <Center
                    style={tw` border  border-dashed border-opacity-50 border-gray-400  md:top-0 top-0   right-0 p-2  h-full w-full bg-black text-white `}>

                    <Text style={tw`text-center mt-8 text-green-600 text-2xl font-bold`}>Cart</Text>

                    <ScrollView $sm-w={'$full'} $md-w={'$3/4'} $lg-w={'$1/2'} style={tw` border border-yellow-300 min-w-90 p-4 h-30  gap-2`}>
                        {Object.values(lineItems).map(item => {
                            return (
                                <CartItem key={item.priceID} item={item} />
                            )
                        })}
                    </ScrollView >

                    <View style={tw`relative mt-2 `}>
                        <VStack style={tw` justify-center items-center `}>
                            <HStack space='lg' style={tw`flex w-full mb-2`}>
                                <Text >Total</Text>
                                <Text style={tw`font-extrabold text-white`}>${total}</Text>
                            </HStack>
                            <CheckoutScreen setIsLoading={setIsLoading} UID={UID} cart={state} styles={`bg-green-700 h-12 text-center font-bold rounded`} />
                        </VStack>
                    </View>
                </Center>
            </SafeAreaView>

        </View>
    )
}

export default Cart
