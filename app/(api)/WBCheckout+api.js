import { deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import Cors from "micro-cors";
import { useFetchDocs } from "../../hooks/useFetchDocs";
import useSetDocument from "../../hooks/useSetDocument";
import { data as db } from "../../firebaseConfig";
import { orderNumberPrefix } from "../../constants/META";



const stripe = require("stripe")(process.env.STRIPE_PRIVATE);

const cors = Cors({
    allowMethods: ["POST", "HEAD"],
});

const secret = 'whsec_54088d65e838c6a950fea91d163ee3b3d77328f523414be51057a80ebc1615de';

export async function POST(request) {
    try {
        const body = await request.text();
        const signature = request.headers.get("stripe-signature");
        const event = stripe.webhooks.constructEvent(body, signature, secret);
        if (event.type === "checkout.session.completed" || "payment_intent.succeeded" || 'charge.succeeded') {
            const { type } = event.data.object.metadata

            if (type == 'checkout') {
                const { uid, cartID, } = event.data.object.metadata
                const { orderID } = await useFethData('Admin', 'IDs')
                const { name, email, exp, expToLv, level, loyaltyPoints } = await useFetchData('Users', uid)
                const PTRate = 4 * level / 100



                const CART = await useFetchDocs('Carts', 'cartID', '==', cartID, 'time') //Object.values(JSON.parse(fullCart))
                const CurrentOrder = Object.values(CART[0].cart)

                //const cart = CurrentOrder?.lineItems ? CurrentOrder?.lineItems : {}
                const addArray = (array) => {
                    const mainArray = Array.isArray(array) ? array : Object.values(array ? array : {})
                    const sum = mainArray.reduce((partialSum, a) => partialSum + a, 0)
                    return sum
                }

                const getArrayToAddQTY = async () => {
                    const total = CurrentOrder.map((orderInfo) => {
                        return orderInfo.Qty
                    })
                    return total
                }
                const getArrayToAddPrice = async () => {
                    const total = CurrentOrder.map((orderInfo) => {
                        return Number(orderInfo.price)
                    })
                    return total
                }

                const getArrayToAddImages = async () => {
                    const total = CurrentOrder.map((orderInfo) => {
                        return orderInfo.images[0]
                    })
                    return total
                }

                const arrayQTY = await getArrayToAddQTY()
                const arrayPrice = await getArrayToAddPrice()
                const arrayImages = await getArrayToAddImages()
                const orderQTY = addArray(arrayQTY)
                const orderPrice = addArray(arrayPrice)
                console.log('first')
                const order = {
                    userInfo: {
                        name: name,
                        email: email
                    },
                    orderedItems: CART[0].cart,
                    id: `${orderNumberPrefix}-${orderID}`,
                    qty: orderQTY,
                    total: orderPrice,
                    images: arrayImages,
                    user: uid,
                    status: 'not started',
                    driverLocationWhenComplete: [],
                    dateServer: serverTimestamp(),
                    dateReal: new Date().toLocaleString()
                }

                const ORDERID = order.id
                await useSetDocument('Orders', ORDERID, order)

                const ORDERS = await useFetchDocs('Orders', 'id', '==', ORDERID, 'id') //Object.values(JSON.parse(fullCart))

                if (ORDERS[0].id == ORDERID) {

                    await useSetDocument('Admin', 'Orders', {
                        orderID: orderID + 1
                    })
                }

                //await useSetDocument('User', uid, {currentOrder: ORDERID})
                console.log(order)
                const gainedXP = orderPrice
                let expCarry = (exp + gainedXP) - expToLv
                expCarry = expCarry < 0 ? 0 : expCarry

                useSetDocument('Users', uid, {
                    loyaltyPoints: loyaltyPoints + orderPrice * PTRate,
                    exp: expCarry > 0 ? expCarry : exp + gainedXP,
                    level: expCarry > 0 ? level + 1 : level,
                    expToLv: expToLv + 25

                })
                await deleteDoc(doc(db, 'Carts', cartID))

            }




        }

        return Response.json({ result: event, ok: true });
    } catch (error) {
        console.error(error);
        return Response.json(
            {
                message: "something went wrong",
                ok: false,
            },
            { status: 500 }
        );
    }
}