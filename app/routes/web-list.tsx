import { useEffect, useState } from "react";
import WebItem from "~/components/WebItem";
import type { IWeb } from "~/models/webModel";
import { webResponsesService } from "~/services/webResponseService";


export function meta() {

    const title = "Web Response List - API Khain.app";
    const description = `${title} - Web response created by Khain.app API`;

    return [
        { title },
        { name: "description", content: description },
    ];
}




export default function WebList() {
    const [webList, setWebList] = useState<IWeb[]>([]);
    const [currentUser, setCurrentUser] = useState<any>(null);


    useEffect(() => {
        // Load user from localStorage
        const user = localStorage.getItem("currentUser");
        if (user) setCurrentUser(JSON.parse(user));
    }, []);

    useEffect(() => {
        if (currentUser) {
            webResponsesService.getWebsByUserID(currentUser?.uid).then((webList) => setWebList(webList))
        }
    }, [currentUser]);

    return (
        <main className="max-w-[960px] w-full mx-auto">
            <WebItem webList={webList}/>


        </main>
    )
}


