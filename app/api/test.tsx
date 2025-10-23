import type { ActionFunctionArgs } from "react-router";


export async function action({ request }: ActionFunctionArgs) {
    const data = await request.json()

    const payload = ({
        name: data.name,
        email: data.email!,
        file_link: data.file_link,
    });

    console.log(payload)

    const emailjsResponse = await fetch(`http://localhost:5173/webhook/email`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    const result = await emailjsResponse.json()

    console.log("RESULT : ", result)

    return Response.json({
        msg: "successfully"
    }, { status: 200 })
}