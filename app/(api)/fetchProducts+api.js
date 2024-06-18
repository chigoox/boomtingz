import Stripe from "stripe";


export async function POST(request) {
    //let data = await request.json();
    const stripe = new Stripe('sk_test_51PHR6VLenbFU4c2HxqXoggndRaB2rRUK0Dx4JpBjoqNtAVooSBHYDGf2sfzIPLySYiNaW11myEXzwIB1q0YZlc9E00fQ1NkwY1')
    const prices = await stripe.products.list({
        limit: 100

    });

    return Response.json(prices.data.reverse())
}

