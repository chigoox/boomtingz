import { deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import Cors from "micro-cors";
import { useFetchDocs } from "../../hooks/useFetchDocs";
import useSetDocument from "../../hooks/useSetDocument";
import { data as db } from "../../firebaseConfig";
import { EXPRATE, orderNumberPrefix } from "../../constants/META";



const stripe = require("stripe")(process.env.STRIPE_PRIVATE);

const cors = Cors({
    allowMethods: ["POST", "HEAD"],
});

const secret = 'whsec_2nPDTeK11uqkjDgjwm0HwRKZp9NFj2Qu';

export async function POST(request) {
    try {
        const body = await request.text();
        const signature = request.headers.get("stripe-signature");
        const event = stripe.webhooks.constructEvent(body, signature, secret);
        if (event.type === "checkout.session.completed" || "payment_intent.succeeded" || 'charge.succeeded') {
            const { type } = event.data.object.metadata
            if (type == 'checkout') {
                console.log(type)
                const { uid, cartID, } = event.data.object.metadata
                const { orderID } = await useFethData('Admin', 'IDs')
                let { name, email, exp, expToLv, level, loyaltyPoints } = await useFetchData('Users', uid)
                level = Math.floor(level) || 0
                const PTRate = EXPRATE(level)
                let points = Math.floor(loyaltyPoints) || 0
                exp = Math.floor(exp) || 0
                expToLv = Math.floor(expToLv) || 0



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

                const loyaltyPointsGained = Number(points + (orderPrice * PTRate))



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
                    loyaltyPoints: loyaltyPointsGained,
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
                const gainedXP = formPoints;
                let expCarry = (exp + gainedXP) - expToLv;
                expCarry = expCarry < 0 ? 0 : expCarry;
                const carryLvs = Math.floor(expCarry / expToLv);

                useSetDocument('Users', uid, {
                    loyaltyPoints: loyaltyPointsGained,
                    exp: expCarry > 0 ? expCarry % expToLv : exp + gainedXP,
                    level: level >= 100 ? 100 : level + (expCarry > 0 ? carryLvs + 1 : 0),
                    expToLv: (expCarry > 0 || carryLvs > 0) ? expToLv + (25 * (carryLvs + 1)) : expToLv,


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