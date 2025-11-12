import { doc, setDoc, getDoc, updateDoc, Timestamp, onSnapshot, increment } from "firebase/firestore";
import { db } from "~/libs/firebase/client";

export interface IUser {
  user_id: string;
  email: string;
  emailVerified: boolean | null;
  name: string;
  image: string;
  usage?: Record<string, any>;
  [key: string]: any; // allow extra fields
}

export const userService = {
  /**
   * Create or update a user in Firestore
   * @param user IUser object
   */
  async createOrUpdateUser(user: IUser) {
    if (!user.user_id) throw new Error("user_id is required");

    const userRef = doc(db, "users", user.user_id);
    const userSnap = await getDoc(userRef);

    const dataToSave = {
      ...user,
      updated_at: Timestamp.now()
    };

    if (userSnap.exists()) {
      // update existing user
      await updateDoc(userRef, dataToSave);
    } else {
      // create new user
      await setDoc(userRef, {
        ...dataToSave,
        created_at: Timestamp.now()
      });
    }

    return { id: user.user_id, ...dataToSave };
  },

  async increaseApiLimit(user_id: string, amount: number = 100) {
    if (!user_id) throw new Error("user_id is required");

    const userRef = doc(db, "users", user_id);
    const userSnap = await getDoc(userRef);



    const currentLimit = userSnap.data()?.api_limit ?? 500;

    // increment limit safely
    const newLimit = currentLimit + amount;

    await updateDoc(userRef, {
      api_limit: newLimit,
      updated_at: Timestamp.now(),
    });

    return newLimit;
  }
  ,

  /**
  * Increase API usage count by 1 (or custom amount)
  */
  async increaseApiUsage(
    user_id: string,
    amount: number = 1,
    defaultLimit: number = 50
  ) {
    if (!user_id) throw new Error("user_id is required");

    const userRef = doc(db, "users", user_id);
    const userSnap = await getDoc(userRef);

    // If user doesn't exist, create with default usage + limit
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        user_id,
        usage: {
          api: amount,
          api_limit: defaultLimit, // ✅ store initial API limit
        },
        created_at: Timestamp.now(),
        updated_at: Timestamp.now(),
      });
      return amount;
    }

    const data = userSnap.data();
    const currentUsage = data?.usage?.api ?? 0;
    const userLimit = data?.usage?.api_limit ?? defaultLimit; // ✅ read stored limit or fallback

    if (currentUsage >= userLimit) {
      return -1;
    }

    // increment safely
    await updateDoc(userRef, {
      "usage.api": increment(amount),
      updated_at: Timestamp.now(),
    });

    return currentUsage + amount;
  },

  /**
   * Optional: get user by ID
   */
  async getUserById(user_id: string) {
    const userRef = doc(db, "users", user_id);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return null;
    return { id: userSnap.id, ...userSnap.data() };
  },

  async listenToUserUsageApi(user_id: string, callback: (data: any | null) => void) {
    if (!user_id) throw new Error("user_id is required");

    const userRef = doc(db, "users", user_id);

    // Listen in realtime to this user's document
    const unsubscribe = onSnapshot(
      userRef,
      (userSnap: { exists: () => any; data: () => any; id: any; }) => {
        if (!userSnap.exists()) {
          callback(null);
          return;
        }

        const data = userSnap.data();
        const usageApi = data?.usage?.api ?? null;
        const userLimit = data?.api_limit ?? 50;

        // same style of return structure as your getUserById
        callback({
          id: userSnap.id,
          usageApi,
          api_limit: userLimit,
        });
      },
      (error) => {
        console.error("Error listening to user:", error);
        callback(null);
      }
    );

    return unsubscribe; // allow caller to stop listening
  }
};
