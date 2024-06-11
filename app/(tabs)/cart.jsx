
import { fetchDocument } from '../../constants/Utils'
import { useEffect, useState } from "react";
import { Button, View } from "@gluestack-ui/themed";
import tw from "twrnc";
import Loading from '../../components/Loading.jsx'
import { useCartContext } from '../../StateManger/CartConext.jsx'
import useAUTHListener from '../../StateManger/AUTHListener.jsx';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { Text } from '@gluestack-ui/themed';


const Trash2Icon = <Ionicons name='trash' />
const AiOutlineClose = <AntDesign name='outline-close' />

function Cart({ showCart, setShowCart }) {

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


    return (
        <View
            style={tw`fixed z-[999] border-l border-dashed border-opacity-50 border-gray-400  md:top-0 top-0 trans  right-0 ${showCart ? 'w-[50vw] md:w-[25vw] p-2' : 'w-[0] P-0 overflow-hidden'} h-[100vh] bg-black-800 text-white bg-opacity-50`}>
            {isLoading && <Loading />}

            <View style={tw`center gap-2`}>
                <Text style={tw`${showCart ? '' : 'left-20 relative'}  text-center text-2xl font-bold`}>Cart</Text>
                {Object.values(lineItems).map(item => {
                    return (
                        <View key={item.priceId + getRand()} style={tw`h-52 md:h-48  flex-shrink-0 border-b-2 border-gray-700  relative`}>
                            <View style={tw`evenly gap-2 relative h-1/2 top-4`}>
                                <Card shadow="true" style={tw`w-24 h-full relative bg-black overflow-hidden`}>
                                    <Image fill src={item.images ? item.images[0] : ''} alt="" />

                                </Card>
                                <View style={tw`p-1  w-1/2`}>
                                    <Text style={tw`md:text-lg`}>{item.name?.substr(0, 20)}{item?.name?.length > 20 ? '...' : ''}</Text>
                                    {item?.variant && <Text style={tw`font-light text-xs h-4 overflow-hidden`}>{item?.variant}</Text>}
                                    <Text style={tw`font-bold`}>{String(item?.price).includes('$') ? '' : '$'}{item?.price}</Text>
                                </View>


                            </View>
                            <View style={tw`text-black mt-8`}>
                                {/*  <ItemQTYButton product={item} forCart={true} /> */}
                            </View>
                            <Button onPress={() => { RemoveFromCart(item) }} style={tw`h-6 mb-2 rounded-t-md font-semibold w-24  center text-red-500 bg-gray-600 m-auto bottom-0 `}>
                                <Trash2Icon />
                            </Button>
                        </View>
                    )
                })}

            </View >
            <View style={tw`center-col relative bottom-4 text-white`}>
                <View style={tw`${showCart ? 'scale-1' : 'scale-0'} trans-slow evenly w-full `}>
                    <Text >Total</Text>
                    <Text style={tw`font-extrabold`}>${total}</Text>
                </View>


                <Button onPress={(event) => {
                    checkShippingInfo(event)

                }} style={tw`w-3/4 h-12 bg-blue-700 font-bold rounded hover:text-lg trans`}>
                    <Text>CheckOut</Text>
                </Button>

            </View>

        </View >
    )
}

export default Cart
