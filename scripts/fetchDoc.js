import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { data as db } from '../firebaseConfig';

const fetchDoc = async (collection, document, listen) => {
    const documentRef = doc(db, collection, document)


    if (listen) {
        onSnapshot(documentRef, (doc) => {
            listen(doc.data())
        });
    }

    const snapShot = await getDoc(documentRef)
    if (snapShot.exists) {
        console.log('data:', snapShot.data())
        return (snapShot.data())
    }
    else {
        return ('No such document!')
    }


}

export default fetchDoc
