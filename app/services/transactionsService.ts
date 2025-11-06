// ~/services/transactionsService.ts


import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "~/libs/firebase/client";
import type { ITransaction } from "~/models/transactionModel";

const TRANSACTIONS_COLLECTION = "transactions";

export const transactionsService = {
  /**
   * Create a new transaction record
   */
  async create(transaction: ITransaction) {
    if (!transaction.user_id) throw new Error("user_id is required");
    if (!transaction.name) throw new Error("name is required");
    if (typeof transaction.amount !== "number") throw new Error("amount must be a number");

    const q = query(
      collection(db, TRANSACTIONS_COLLECTION),
      where("session_id", "==", transaction.session_id)
    );

    const existing = await getDocs(q);

    if (!existing.empty) {
      console.log("Transaction already exists for session:", transaction.session_id);
      return null;
    }

    const docRef = await addDoc(collection(db, TRANSACTIONS_COLLECTION), {
      ...transaction,
      created_at: transaction.created_at || Timestamp.now(),
    });

    return { id: docRef.id, ...transaction };
  },

  /**
   * Get all transactions for a specific user_id (sorted by date desc)
   */
  async getAllWithUserID(user_id: string) {
    if (!user_id) throw new Error("user_id is required");
    console.log("USER : ",user_id)
    const q = query(
      collection(db, TRANSACTIONS_COLLECTION),
      where("user_id", "==", user_id),
      // orderBy("created_at", "desc")
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ITransaction[] | any;
  },

  /**
   * Get all transactions (admin view)
   */
  async getAllTransactions() {
    const q = query(
      collection(db, TRANSACTIONS_COLLECTION),
      orderBy("created_at", "desc")
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ITransaction[] | any;
  },
};
