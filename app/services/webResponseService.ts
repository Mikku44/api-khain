import {
  doc,
  collection,
  setDoc,
  getDoc,
  updateDoc,
  getDocs,
  query,
  where,
  Timestamp,
  onSnapshot,
  deleteDoc,
} from "firebase/firestore";
import { db } from "~/libs/firebase/client";
import type { IWeb } from "~/models/webModel";

export const webResponsesService = {
  /**
   * Create or update a web response in Firestore
   */
  async createOrUpdateWeb(web: IWeb) {
    if (!web.user_id) throw new Error("user_id is required");
    if (!web.body) throw new Error("body is required");

    const webRef = web.id
      ? doc(db, "web-responses", web.id)
      : doc(collection(db, "web-responses"));
    const webSnap = await getDoc(webRef);

    const dataToSave = {
      ...web,
      
      updated_at: Timestamp.now(),
    };

    if (webSnap.exists()) {
      const existingData = webSnap.data();

      if (web.user_id === existingData.user_id) {
        await updateDoc(webRef, dataToSave);
      } else {
        throw new Error("You don't have permission to edit this page!");
      }

    } else {
      if (web.id) {
        return {
          error: "Web ID does not exist."
        }
      }
      await setDoc(webRef, {
        ...dataToSave,
        status:"active",
        created_at: Timestamp.now(),
      });
    }

    return { id: webRef.id, ...dataToSave };
  },

  /**
   * Get all web responses
   */
  async getAllWebs() {
    const websCol = collection(db, "web-responses");
    const querySnap = await getDocs(websCol);

    const webs: (IWeb & { id: string })[] = [];
    querySnap.forEach((docSnap) => {
      webs.push({ id: docSnap.id, ...docSnap.data() } as IWeb & { id: string });
    });

    return webs;
  },

  /**
   * Get web by ID
   */
  async getWebById(id: string) {
    const webRef = doc(db, "web-responses", id);
    const webSnap = await getDoc(webRef);
    if (!webSnap.exists()) return null;
    return { id: webSnap.id, ...webSnap.data() };
  },

  async deleteWebById(id: string) {
    const webRef = doc(db, "web-responses", id);
    await deleteDoc(webRef);
   
    return true;
  },

  /**
   * Get all web responses by user_id
   */
  async getWebsByUserID(user_id: string) {
    if (!user_id) throw new Error("user_id is required");

    const websCol = collection(db, "web-responses");
    const q = query(websCol, where("user_id", "==", user_id));
    const querySnap = await getDocs(q);

    const webs: (IWeb & { id: string })[] = [];
    querySnap.forEach((docSnap) => {
      webs.push({ id: docSnap.id, ...docSnap.data() } as IWeb & { id: string });
    });

    return webs;
  },

  /**
   * Listen to all web responses for a specific user in real-time
   */
  listenWebsByUserID(
    user_id: string,
    callback: (webs: (IWeb & { id: string })[] | null) => void
  ) {
    if (!user_id) throw new Error("user_id is required");

    const websCol = collection(db, "web-responses");
    const q = query(websCol, where("user_id", "==", user_id));

    const unsubscribe = onSnapshot(
      q,
      (querySnap) => {
        const webs: (IWeb & { id: string })[] = [];
        querySnap.forEach((docSnap) => {
          webs.push({ id: docSnap.id, ...docSnap.data() } as IWeb & { id: string });
        });
        callback(webs);
      },
      (error) => {
        console.error("Error listening to web-responses:", error);
        callback(null);
      }
    );

    return unsubscribe;
  },

  /**
   * Listen to a single web response by ID in real-time
   */
  listenWebById(
    id: string,
    callback: (web: (IWeb & { id: string }) | null) => void
  ) {
    if (!id) throw new Error("id is required");

    const webRef = doc(db, "web-responses", id);

    const unsubscribe = onSnapshot(
      webRef,
      (docSnap) => {
        if (docSnap.exists()) {
          callback({ id: docSnap.id, ...docSnap.data() } as IWeb & { id: string });
        } else {
          callback(null); // document deleted or not found
        }
      },
      (error) => {
        console.error("Error listening to web by id:", error);
        callback(null);
      }
    );

    return unsubscribe;
  },
};
