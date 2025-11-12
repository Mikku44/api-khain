import type { Timestamp } from "firebase/firestore";

export interface ITransaction {
    amount : number;
    name : string;
    calls? : number;
    created_at: Timestamp
    session_id : string;
    user_id : string;
}