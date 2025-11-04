import { doc, collection, setDoc, getDoc, updateDoc, getDocs, query, where, Timestamp, onSnapshot } from "firebase/firestore";
import { db } from "~/libs/firebase/client";
import type { IToken } from "~/models/tokenModel";


export const tokenService = {
  /**
   * Create or update a token in Firestore
   * @param token IToken object
   */
  async createOrUpdateToken(token: IToken) {
    if (!token.user_id) throw new Error("user_id is required");
    if (!token.token) throw new Error("token string is required");

    const tokenRef = token.id ? doc(db, "tokens", token.id) : doc(collection(db, "tokens"));
    const tokenSnap = await getDoc(tokenRef);

    const dataToSave = {
      ...token,
      updated_at: Timestamp.now(),
    };

    if (tokenSnap.exists()) {
      // update existing token
      await updateDoc(tokenRef, dataToSave);
    } else {
      // create new token
      await setDoc(tokenRef, {
        ...dataToSave,
        created_at: Timestamp.now(),
      });
    }

    return { id: tokenRef.id, ...dataToSave };
  },

  async getAllTokens() {
    const tokensCol = collection(db, "tokens");
    const querySnap = await getDocs(tokensCol);

    const tokens: (IToken & { id: string })[] = [];
    querySnap.forEach((docSnap) => {
      tokens.push({ id: docSnap.id, ...docSnap.data() } as IToken & { id: string });
    });

    return tokens;
  },

  /**
   * Get token by ID
   */
  async getTokenById(id: string) {
    const tokenRef = doc(db, "tokens", id);
    const tokenSnap = await getDoc(tokenRef);
    if (!tokenSnap.exists()) return null;
    return { id: tokenSnap.id, ...tokenSnap.data() };
  },

  /**
   * Get all tokens for a specific user_id
   */
  async getTokensWithUserID(user_id: string) {
    const tokensCol = collection(db, "tokens");
    const q = query(tokensCol, where("user_id", "==", user_id));
    const querySnap = await getDocs(q);

    const tokens: (IToken & { id: string })[] = [];
    querySnap.forEach((docSnap) => {
      tokens.push({ id: docSnap.id, ...docSnap.data() } as IToken & { id: string });
    });

    return tokens;
  },

  /**
   * Listen to tokens for a specific user_id in realtime
   */
  listenTokensWithUserID(user_id: string, callback: (tokens: (IToken & { id: string })[] | null) => void) {
    if (!user_id) throw new Error("user_id is required");

    const tokensCol = collection(db, "tokens");
    const q = query(tokensCol, where("user_id", "==", user_id));

    const unsubscribe = onSnapshot(
      q,
      (querySnap) => {
        const tokens: (IToken & { id: string })[] = [];
        querySnap.forEach((docSnap) => {
          tokens.push({ id: docSnap.id, ...docSnap.data() } as IToken & { id: string });
        });
        callback(tokens);
      },
      (error) => {
        console.error("Error listening to tokens:", error);
        callback(null);
      }
    );

    return unsubscribe;
  },
};
