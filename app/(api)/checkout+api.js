import Stripe from "stripe";
import { getRandTextNum } from "../../constants/Utils";
import { siteName } from "../../constants/META";
import useSetDocument from "../../hooks/useSetDocument";
import { Timestamp, serverTimestamp } from "firebase/firestore";


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
                const customer = await stripe.customers.create();

                const ephemeralKey = await stripe.ephemeralKeys.create(
                    { customer: customer.id },
                    { apiVersion: '2022-11-15' }
                );

                const paymentIntent = await stripe.paymentIntents.create({
                    amount: total * 100,
                    currency: 'usd',
                    customer: customer.id,
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
                    customer: customer.id,
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
                        if (product.category == 'Tobacco') {
                            return {
                                priceData: {
                                    currency: 'usd',
                                    unit_amount: Number(product.price) * 100,
                                    product_data: {
                                        name: product.name.split('').reverse().join(''),
                                        description: 'All other prd',
                                        images: ['https://images.unsplash.com/photo-1716277486487-1c9d08eaf021?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
                                    },
                                    quantity: product.Qty,
                                }
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
                    success_url: `http://${!__DEV__ ? siteName?.replace(/\s/g, '').replace(/\'/g, '') + '.vercel.app' : 'localhost:8081'}/orderSuccess/`,
                    cancel_url: `http://${!__DEV__ ? siteName?.replace(/\s/g, '').replace(/\'/g, '') + '.vercel.app' : 'localhost:8081'}/`,
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


