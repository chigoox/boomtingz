import { serverTimestamp } from "firebase/firestore";
import Stripe from "stripe";
import { getRandTextNum } from "../../constants/Utils";
import useSetDocument from "../../hooks/useSetDocument";
import fetchDoc from "../../scripts/fetchDoc";


export async function POST(request) {
    const stripe = new Stripe('sk_test_51PHR6VLenbFU4c2HxqXoggndRaB2rRUK0Dx4JpBjoqNtAVooSBHYDGf2sfzIPLySYiNaW11myEXzwIB1q0YZlc9E00fQ1NkwY1')
    const data = await request.json()
    const { cart, location, UID } = data
    const lineItems = Object.values(cart?.lineItems) || []
    const TOTAL = cart?.lineItems || 0
    let total = 0
    for (let index = 0; index < lineItems.length; index++) {
        total += lineItems[index].price * lineItems[index].Qty;
    }
    const cartID = getRandTextNum()

    const createTempCart = async () => {
        await useSetDocument('Carts', cartID, {
            cart: lineItems,
            total: total,
            cartID: cartID,
            user: UID,
            time: serverTimestamp()
        })
    }






    switch (location) {
        case 'mobile':
            try {

                const { customerID, name, email, phone } = await fetchDoc('Users', UID) || false
                console.log(customerID)
                const customer = !customerID ? await stripe.customers.create({ name: name, email: email, phone: (phone || '0000000000') }) : null
                if (customer) {
                    useSetDocument('Users', UID, { customerID: customer.id })
                }

                const ephemeralKey = await stripe.ephemeralKeys.create(
                    { customer: customerID || customer?.id },
                    { apiVersion: '2022-11-15' }
                );

                const paymentIntent = await stripe.paymentIntents.create({
                    amount: total * 100,
                    currency: 'usd',
                    customer: customerID || customer?.id,
                    metadata: {
                        uid: UID,
                        total: total,
                        type: 'checkout',
                        cartID: cartID
                    },
                    // In the latest version of the API, specifying the `automatic_payment_methods` parameter
                    // is optional because Stripe enables its functionality by default.
                    automatic_payment_methods: {
                        enabled: true,
                    },


                });

                createTempCart()

                return Response.json({
                    paymentIntent: paymentIntent.client_secret,
                    ephemeralKey: ephemeralKey.secret,
                    customer: customerID || customer?.id,
                    publishableKey: 'pk_test_51PHR6VLenbFU4c2Ha1rkyVqmQ3qhQKOI2Ud9NQfbSeJsZ056O1Wcr8YCkbTgEIPPmP4NEhW7QefVW94aehYijAr000qLipw1CQ',
                    cartID: cartID
                })
            } catch (error) {
                console.error(error.message)
            }
            break;
        case 'web':
            //let { cart, UID, total, cartID } = data
            try {
                const session = await stripe.checkout.sessions.create({
                    line_items: lineItems.map(product => {
                        console.log(product.Qty)
                        if (product.category == 'Tobacco') {
                            return {
                                price_data: {
                                    currency: 'usd',
                                    unit_amount: Number(product.price) * 100,
                                    product_data: {
                                        name: product.name.split('').reverse().join(''),
                                        description: 'The good stuff',
                                        images: ['https://images.unsplash.com/photo-1514931181523-5fc9ac41ea38?q=80&w=1094&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
                                    },
                                },
                                quantity: product.Qty,
                            }
                        } else {
                            return {
                                price: product.priceID,
                                quantity: product.Qty
                            }
                        }

                    }


                    ),
                    mode: 'payment',
                    success_url: __DEV__ ? `http://localhost:8081/orderSuccess?session_id={CHECKOUT_SESSION_ID}&UID=${UID}` : `https://boomtingz.vercel.app/orderSuccess?session_id={CHECKOUT_SESSION_ID}&UID=${UID}`,
                    cancel_url: __DEV__ ? 'http://localhost:8081' : `https://boomtingz.vercel.app`,
                    metadata: {
                        uid: UID,
                        cartID: cartID,
                        total: total,
                        type: 'checkout'
                    },

                })
                createTempCart()
                return Response.json(session.url)
            } catch (error) {
                console.error(error.message)
            }
            break;
        default:
            break;
    }
}


