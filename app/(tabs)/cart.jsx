
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
    const showCart = ''
    const { state } = useCartContext()
    const { lineItems, total } = state
    const user = useCheckSignedIn()
    const [event, setEvent] = useState()
    const [shippingData, setShippingData] = useState({})
    const UID = user?.uid
    const [isLoading, setIsLoading] = useState(false)
    let checkOutItems = Object.values(lineItems).map(item => ({ price: item.priceID, category: item.category, quantity: Number(item.Qty) }))
    checkOutItems = checkOutItems.filter(item => item.category != 'Tobacco')
    checkOutItems = checkOutItems.map(i => {
        delete i.category
        return i
    })


    const [getShippingWindow, setGetShippingWindow] = useState(false)
    const toggleGetShippingInfo = () => {

    }



    const getShippingInfo = (shippinginfo) => {

        setGetShippingWindow(false)
        let TobaccoProducts = Object.values(lineItems).map(i => {
            if (i.category == 'Tobacco') return i
        })
        TobaccoProducts = (filterNullFromArray(TobaccoProducts))
        let total = 0
        for (let index = 0; index < TobaccoProducts.length; index++) {
            const element = TobaccoProducts[index];
            const totalPrice = element.price * element.Qty
            total += totalPrice
        }
        const TobaccoItem = {
            price_data: {
                currency: 'usd',
                unit_amount: total * 100,
                product_data: {
                    name: 'T Products',
                    description: 'All other prd',
                    images: ['https://images.unsplash.com/photo-1716277486487-1c9d08eaf021?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
                },
            },
            quantity: 1,
        }
        if (TobaccoProducts && total > 0) checkOutItems.push(TobaccoItem)
        if (checkOutItems) checkout(event, [checkOutItems, total], UID, lineItems)
    }

    const checkShippingInfo = async (_event) => {
        //Always Show ShippingInfo
        /* setIsLoading(true)
        if (!g_u_ID) message.error('You should signup! Using Guest!')
        if (g_u_ID) await fetchDocument('User', g_u_ID, setShippingData)
        setEvent(_event)
        setGetShippingWindow(true)
        setIsLoading(false)
 */

        //Show shippinginfo if not in database
        /* .then((data) => {
                if (data?.ShippingInfo) {
                    checkout(_event, checkOutItems, g_u_ID)
                } else {
                    setEvent(_event)
                    setGetShippingWindow(true)


                }
            }) */
    }

    //updates cart in database
    useEffect(() => {
        if (UID && state) useSetDocument('User', UID, state)
    }, [lineItems])


    useEffect(() => {
        if (!showCart) setGetShippingWindow(false)
    }, [showCart])

    return (
        <View h={'$full'} bgColor='$black'>
            <SafeAreaView h={'$full'}>
                <Center
                    style={tw` border  border-dashed border-opacity-50 border-gray-400  md:top-0 top-0   right-0 p-2  h-full w-full bg-black text-white `}>
                    {isLoading && <Loading />}

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


                            <CheckoutScreen cart={state} styles={`bg-green-700 h-12 text-center font-bold rounded`} />

                        </VStack>
                    </View>

                </Center>
            </SafeAreaView>
        </View>
    )
}

export default Cart
