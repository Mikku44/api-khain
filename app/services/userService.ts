import { doc, setDoc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
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

  /**
   * Optional: get user by ID
   */
  async getUserById(user_id: string) {
    const userRef = doc(db, "users", user_id);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return null;
    return { id: userSnap.id, ...userSnap.data() };
  }
};
