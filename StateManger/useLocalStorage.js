import { addToDocumentCollection, fetchDocument } from '@/constants/Utils';
import { auth } from '@/firebaseConfig';
import useFetchData from '@/hooks/useFetchData';
import useSetDocument from '@/hooks/useSetDocument';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';

function useLocalStorage(state, dispatch, initialCartState) {
    //const user = useAUTHListener()

    const user = auth?.currentUser



    useEffect(() => {
        const getCart = async () => {
            getDoc(doc('Us'))
            //if (state.lineItems.length == 0)

        }
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