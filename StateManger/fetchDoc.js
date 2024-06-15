import { doc, getDoc, onSnapshot } from "firebase/firestore";

export const fecthDoc = async (collection, document, listen) => {
    const documentRef = doc(db, collection, document)

    if (listen) {
        onSnapshot(documentRef, (doc) => {
            listen(doc.data())
        });
    }

    const snapShot = await getDoc(documentRef)

    if (snapShot.exists) {
        return (snapShot.data())
        console.log('data:', snapShot.data())
    }
    else {
        return ('No such document!')
    }


}