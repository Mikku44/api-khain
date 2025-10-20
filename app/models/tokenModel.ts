import { Timestamp } from "firebase/firestore";

export interface IToken {
    id?: string
    create_at: Timestamp
    plan: string
    token: string
    usage: number           
    status?: string          
    name?: string           
    user_id: string
}
