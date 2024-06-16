import Stripe from "stripe";


export async function POST(request) {
    const stripe = new Stripe('sk_test_51PHR6VLenbFU4c2HxqXoggndRaB2rRUK0Dx4JpBjoqNtAVooSBHYDGf2sfzIPLySYiNaW11myEXzwIB1q0YZlc9E00fQ1NkwY1')

    const data = await request.json()
    const { cart, location } = data
    const lineItems = Object.values(cart?.lineItems) || []
    const TOTAL = cart?.lineItems || 0

    const customer = await stripe.customers.create();

    const ephemeralKey = await stripe.ephemeralKeys.create(
        { customer: customer.id },
        { apiVersion: '2022-11-15' }
    );


    let total = 0
    for (let index = 0; index < lineItems.length; index++) {
        total += lineItems[index].price * lineItems[index].Qty;
    }


    console.log(total)

    const paymentIntent = await stripe.paymentIntents.create({
        amount: total * 100,
        currency: 'usd',
        customer: customer.id,
        // In the latest version of the API, specifying the `automatic_payment_methods` parameter
        // is optional because Stripe enables its functionality by default.
        automatic_payment_methods: {
            enabled: true,
        },
    });

    return Response.json({
        paymentIntent: paymentIntent.client_secret,
        ephemeralKey: ephemeralKey.secret,
        customer: customer.id,
        publishableKey: 'pk_test_51PHR6VLenbFU4c2Ha1rkyVqmQ3qhQKOI2Ud9NQfbSeJsZ056O1Wcr8YCkbTgEIPPmP4NEhW7QefVW94aehYijAr000qLipw1CQ'
    })
}


