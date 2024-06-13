import { doc, setDoc } from 'firebase/firestore';
import { data as db } from '../firebaseConfig';

const useSetDocument = (collection, document, data) => {

    const setData = async () => {
        if (!collection || !document || !data) return
        try {
            await setDoc(doc(db, collection, document), data, { merge: true })
        } catch (error) {
            console.log(error.message)
        }

    }

    setData()



}

export default useSetDocument