import { collection, getDocs, orderBy, query, where } from "firebase/firestore"
import { data as db } from '../firebaseConfig';

const useFetchDocs = async (datacollection, key, opp, value, orderby) => {
    const ref = collection(db, `${datacollection}`)
    const qry = orderby ? query(ref, where(`${key}`, `${opp}`, `${value}`), orderBy(`${orderby}`, 'desc')) : query(ref, where(`${value}`, `${opp}`, `${key}`))
    const snapShot = await getDocs(qry)
    let data = []
    snapShot.forEach((doc) => {
        data = [...data, doc.data()]
    });
    return data
}

export default useFetchDocs