import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, query, serverTimestamp, Timestamp, where } from "firebase/firestore"
import { db } from "~/libs/firebase/client"
import type { IToken } from "~/models/tokenModel";

import { SignJWT } from "jose";

const secret = new TextEncoder().encode(import.meta.env.VITE_JWT_SECRET || "your-secret-key");

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

export async function getValidateToken(token: string) {
  const q = query(collection(db, "tokens"), where("token", "==", token));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null; // token not found
  }

  // Assuming token is unique, return the first match
  const doc = snapshot.docs[0];
  const data = doc.data() as IToken;

  return {
    id: doc.id,
    ...data,
  };
}

export function listenAPIKeysWithUser(
  user_id: string,
  callback: (tokens: IToken[]) => void
) {
  const q = query(collection(db, "tokens"), where("user_id", "==", user_id));

  return onSnapshot(q, (snapshot) => {
    const tokens = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as IToken[];

    callback(tokens);
  });
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



export async function createToken({ user_id,name }: { user_id: string ,name? :string}) {
  const tokensRef = collection(db, "tokens");

  const uuid = crypto.randomUUID();

  const token = await new SignJWT({ user_id, uuid, name })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);
  

  // 2. Create new token if none exists
  const newToken = {
    name ,
    user_id,
    created_at: serverTimestamp(),
    plan: "free",
    token:token, 
    usage: 0,
    status: "active",
  };

  const doc = await addDoc(tokensRef, newToken);
  return { exists: false, id: doc.id, data: newToken };
}

export async function deleteToken(tokenId: string) {
  try {
    await deleteDoc(doc(db, "tokens", tokenId));
    return { success: true };
  } catch (error) {
    console.error("Failed to delete token:", error);
    return { success: false, error };
  }
}