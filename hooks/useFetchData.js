import { auth } from '@/firebaseConfig';
import { router } from 'expo-router';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { data as db } from '../firebaseConfig';


const useFetchData = (collection, document, listen) => {

    const [data, setData] = useState()

    const getData = async () => {
        if (!collection || !document) return

        const documentRef = doc(db, collection, document)

        if (listen) {
            onSnapshot(documentRef, (doc) => {
                listen(doc.data())
            });
        }

        const snapShot = await getDoc(documentRef)

        if (snapShot.exists) {
            setData(snapShot.data())
            console.log('data:', snapShot.data())
        }
        else {
            setData('No such document!')
        }
    }

    useEffect(() => {
        getData()
    }, [collection, document])
    return data

}

export default useFetchData