
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { Button, ButtonText, Card, Center, HStack, Image, SafeAreaView, ScrollView, Text, VStack, View } from "@gluestack-ui/themed";
import { useEffect, useState } from "react";
import tw from "twrnc";
import useAUTHListener from '../../StateManger/AUTHListener.jsx';
import { useCartContext } from '../../StateManger/CartConext.jsx';
import Loading from '../../components/Loading.jsx';
import { fetchDocument, getRandNum } from '../../constants/Utils';
import ItemQTYButton from '../../components/Shop/ItemQTYButton.jsx';


const Trash2Icon = <Ionicons name='trash' color={'red'} />
const AiOutlineClose = <AntDesign name='outline-close' />

function Cart() {
    const showCart = ''
    const { state, dispatch } = useCartContext()
    const { lineItems, total } = state
    const user = useAUTHListener()
    const [event, setEvent] = useState()
    const [shippingData, setShippingData] = useState({})
    const g_u_ID = user?.uid ? user?.uid : user?.gid
    const [isLoading, setIsLoading] = useState(false)
    let checkOutItems = Object.values(lineItems).map(item => ({ price: item.priceID, category: item.category, quantity: Number(item.Qty) }))
    checkOutItems = checkOutItems.filter(item => item.category != 'Tobacco')
    checkOutItems = checkOutItems.map(i => {
        delete i.category
        return i
    })
    const RemoveFromCart = (itemRemove) => {
        dispatch({ type: "REMOVE_FROM_CART", value: itemRemove })
    }


    const [getShippingWindow, setGetShippingWindow] = useState(false)
    const toggleGetShippingInfo = () => {

    }

    useEffect(() => {
        if (g_u_ID && state) updateDatabaseItem('User', g_u_ID, 'cart', state)
    }, [lineItems])

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
        if (checkOutItems) checkout(event, [checkOutItems, total], g_u_ID, lineItems)
    }

    const checkShippingInfo = async (_event) => {
        //Always Show ShippingInfo
        setIsLoading(true)
        if (!g_u_ID) message.error('You should signup! Using Guest!')
        if (g_u_ID) await fetchDocument('User', g_u_ID, setShippingData)
        setEvent(_event)
        setGetShippingWindow(true)
        setIsLoading(false)


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

    useEffect(() => {
        if (!showCart) setGetShippingWindow(false)


    }, [showCart])

    const mock = { a: 1, b: 2, c: 3, q: 2, f: 3, j: 2, z: 9, }
    return (
        <View h={'$full'} bgColor='$black'>
            <SafeAreaView h={'$full'}>
                <Center
                    style={tw` border  border-dashed border-opacity-50 border-gray-400  md:top-0 top-0 trans  right-0 p-2  h-full w-full bg-black text-white `}>
                    {isLoading && <Loading />}

                    <Text style={tw`text-center mt-8 text-green-600 text-2xl font-bold`}>Cart</Text>
                    <ScrollView $sm-w={'$full'} $md-w={'$3/4'} $lg-w={'$1/2'} style={tw`overflow-x-hidden border border-yellow-400 min-w-90 p-4 h-30  gap-2`}>
                        {Object.values(lineItems).map(item => {
                            return (
                                <View key={item.priceId + getRandNum()} style={tw`h-32  border-b-2 border-gray-700  relative`}>
                                    <HStack style={tw`gap-2 items-center justify-center  relative h-1/2 top-4 p-2`}>
                                        <Card style={tw`w-20 h-24 border border-gray-700 border-dashed relative bg-black overflow-hidden`}>
                                            <Image source={{ uri: item.images ? item.images[0] : '' }} alt="" />

                                        </Card>
                                        <View style={tw`p-1  w-1/3`}>
                                            <Text style={tw`text-white`}>{item.name?.substr(0, 20)}{item?.name?.length > 20 ? '...' : '' || 'hello world'}</Text>
                                            {item?.variant || true && <Text style={tw`font-light text-gray-400 text-xs h-4 overflow-hidden`}>{item?.variant || 'test'}</Text>}
                                            <Text style={tw`font-bold  text-white`}>{String(item?.price).includes('$') ? '' : '$'}{item?.price || 200}</Text>
                                        </View>


                                        <View style={tw`text-black  w-1/3`}>
                                            <ItemQTYButton size={'sm'} product={item} forCart={true} />
                                        </View>
                                    </HStack>
                                    <Button onPress={() => { RemoveFromCart(item) }} style={tw`h-6 mb-2  rounded-t-md font-semibold w-24  center text-red-500 bg-gray-600 m-auto bottom-0 `}>
                                        {Trash2Icon}
                                    </Button>
                                </View>
                            )
                        })}

                    </ScrollView >
                    <View style={tw`relative mt-2 `}>
                        <VStack style={tw` justify-center items-center `}>
                            <HStack space='lg' style={tw`flex w-full mb-2`}>
                                <Text >Total</Text>
                                <Text style={tw`font-extrabold text-white`}>${total}</Text>
                            </HStack>


                            <Button onPress={(event) => {
                                checkShippingInfo(event)

                            }} style={tw` h-12 text-center font-bold rounded`}>
                                <ButtonText>CheckOut</ButtonText>
                            </Button>

                        </VStack>
                    </View>

                </Center>
            </SafeAreaView>
        </View>
    )
}

export default Cart
