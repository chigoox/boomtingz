import { auth } from '@/firebaseConfig';
import useSetDocument from '@/hooks/useSetDocument';
import { useEffect, useState } from 'react';
import fetchDoc from '../scripts/fetchDoc'
import { onAuthStateChanged } from 'firebase/auth';
function CartManager(state, dispatch, initialCartState) {
    const user = auth?.currentUser


    //restore cart from database init
    useEffect(() => {
        const getCart = async () => {
            onAuthStateChanged(auth, async (user) => {
                if (!user) return
                const data = await fetchDoc('Users', user.uid)
                const { cart } = data
                //console.log(cart)
                if (Object.keys(state?.lineItems || {}).length == 0 && Object.keys(cart.lineItems).length >= 1)
                    dispatch({
                        type: "SAVE_CART",
                        value: cart ? cart : initialCartState
                    });
            })

        }

        if (Object.keys(state.lineItems).length == 0) {
            getCart()

        } else {
            //  console.log(Object.keys(state.lineItems)) 

        }
    }, [])





    //update cart in database
    useEffect(() => {

        if (state !== initialCartState) {
            if (user?.uid) useSetDocument('Users', user?.uid, { cart: { ...state } })
        }
    }, [state]);

    return (
        []
    )
}

export default CartManager