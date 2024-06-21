import { auth } from '@/firebaseConfig';
import useSetDocument from '@/hooks/useSetDocument';
import { useEffect, useState } from 'react';
import fetchDoc from '../scripts/fetchDoc'
import { onAuthStateChanged } from 'firebase/auth';
function CartManager(state, dispatch, initialCartState) {
    const user = auth?.currentUser

    const [cartFromDB, setCartFromDB] = useState()

    //restore cart from database init
    useEffect(() => {
        const getCart = async () => {
            onAuthStateChanged(auth, async (user) => {
                if (!user) return
                const data = await fetchDoc('Users', user.uid, setCartFromDB)
                const { cart } = data
                //if (Object.keys(state.lineItems).length == 0 && Object.keys(cart.lineItems).length >= 1)
                dispatch({
                    type: "SAVE_CART",
                    value: cart
                });
            })

        }

        if (Object.keys(state.lineItems).length == 0) {

            getCart()

        } else {
            //  console.log(Object.keys(state.lineItems)) 

        }
    }, [])

    useEffect(() => {
        console.log('first')
        dispatch({
            type: "SAVE_CART",
            value: cartFromDB?.cart
        });


    }, [cartFromDB])



    //update cart in database
    useEffect(() => {
        if (state?.total < 0) dispatch({
            type: "EMPTY_CART"
        });
        if (state !== initialCartState) {
            //localStorage.setItem("Cart", JSON.stringify(state));
            if (user?.uid || user?.gid) useSetDocument('Users', user?.uid ? user?.uid : user?.gid, { cart: { ...state } })
            //create and/or set a new localstorage variable called "state"
        }
    }, [state]);

    return (
        []
    )
}

export default CartManager