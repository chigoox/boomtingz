import { useEffect } from 'react';
import { useAUTHListener } from './AUTHListener';
import { getInitCart } from './CartReducer';
import { addToDocumentCollection, fetchDocument } from '@/constants/Utils'

function useLocalStorage(state, dispatch, initialCartState) {
    //const user = useAUTHListener()

    const user = undefined

    const getInitCart = async () => {
        const userData = user?.uid ? await fetchDocument('User', user?.uid) : { cart: { state: { lineItems: [] } } }
        console.log(userData)
        return { lineItems: userData.cart.state.lineItems, total: userData.cart.state.total } || []
    }



    useEffect(() => {
        //checking if there already is a state in localstorage
        const run = async () => {
            const databaseCart = await getInitCart()
            /*  if (databaseCart || JSON.parse(localStorage.getItem("Cart"))) {
                 //if yes, update the current state with the stored one
                 dispatch({
                     type: "SAVE_CART",
                     value: { lineItems: databaseCart.lineItems, total: databaseCart.total } || JSON.parse(localStorage.getItem("Cart")),
                 });
             } */
        }

        if (user) run()
    }, [user]);

    useEffect(() => {
        if (state !== initialCartState) {
            //localStorage.setItem("Cart", JSON.stringify(state));
            if (user.uid || user.gid) addToDocumentCollection('User', user?.uid ? user?.uid : user?.gid, 'cart', { state })



            //create and/or set a new localstorage variable called "state"
        }
    }, [state]);

    return (
        []

    )
}

export default useLocalStorage