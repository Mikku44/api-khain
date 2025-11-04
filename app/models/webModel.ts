import { Timestamp } from "firebase/firestore";

export interface IWeb {
    id?: string
    create_at: Timestamp
    body : string         
    status?: string          
    name?: string           
    user_id: string
}
