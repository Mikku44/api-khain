import { collection, doc, getDocs, query, Timestamp, where } from "firebase/firestore"
import { db } from "~/libs/firebase/client"
import type { IToken } from "~/models/tokenModel";


export async function getAPIKeys() {

    const docRef = query(collection(db, "tokens"))
    const querySnapshot = await getDocs(docRef);

    return querySnapshot.docs.map((doc) => {

        return ({
            id: doc.id,
            ...doc.data()
        }) as IToken
    })

}

export async function getAPIKeysWithUser(user_id: string) {

    const docRef = query(collection(db, "tokens"), where("user_id", "==", user_id))
    const querySnapshot = await getDocs(docRef);

    return querySnapshot.docs.map((doc) => {

        return ({
            id: doc.id,
            ...doc.data()
        }) as IToken
    })

}



export async function createToken({ user_id }: { user_id: string }) {
   
const docRef = query(collection(db, "tokens"), where("user_id", "==", user_id))
    return
}