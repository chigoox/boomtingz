import { collection, getDocs, onSnapshot, orderBy, query, where } from "firebase/firestore"
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

export const useFetchDocsPresist = async (datacollection, key, opp, value, orderby, setter) => {
    const ref = collection(db, `${datacollection}`)
    const qry = orderby ? query(ref, where(`${key}`, `${opp}`, `${value}`), orderBy(`${orderby}`, 'desc')) : query(ref, where(`${value}`, `${opp}`, `${key}`))
    onSnapshot(qry, (querySnapshot) => {
        let data = []
        querySnapshot.forEach((doc) => {
            data = [...data, doc.data()]
        });
        console.log(data)
        setter(data)
    })

}

export default useFetchDocs