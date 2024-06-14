import { addToDocumentCollection, fetchDocument } from '@/constants/Utils';
import { auth } from '@/firebaseConfig';
import useFetchData from '@/hooks/useFetchData';
import useSetDocument from '@/hooks/useSetDocument';
import { useEffect, useState } from 'react';

function useLocalStorage(state, dispatch, initialCartState) {
    //const user = useAUTHListener()

    const user = auth?.currentUser
    const userData = user?.uid ? useFetchData('User', user?.uid) : { cart: { lineItems: [], total: 0 } }
    const getInitCart = async () => {
        if (userData)
            return { lineItems: userData?.cart?.lineItems, total: userData?.cart?.total } || []
    }

    //checking if there already is a state in localstorage


    useEffect(() => {
        const getData = async () => {
            const cart = await getInitCart()

            // getData()

        }, [])



    useEffect(() => {
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

export default useLocalStorage