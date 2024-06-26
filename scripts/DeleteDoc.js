import { deleteDoc, doc } from "firebase/firestore"
import { data } from "../firebaseConfig"

export const DeleteDoc = async (collection, document) => {
    await deleteDoc(doc(data, collection, document))
}