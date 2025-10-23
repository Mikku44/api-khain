import type { ActionFunctionArgs } from "react-router";
import { decodeWithSecret } from "~/libs/cypto/services";

export async function action({ request }: ActionFunctionArgs) {
    try {
        // Get the origin from the request
        const url = new URL(request.url);
        const data = await request.json();
        const origin = url.origin;

        const secretKey = process.env.MY_SECRET_KEY!;

        const fileLink = data.file_link


        const payload = JSON.stringify({
            service_id: process.env.EMAILJS_SERVICE_ID!,
            template_id: process.env.EMAILJS_TEMPLATE_ID!,
            user_id: process.env.EMAILJS_PUBLIC_KEY!,
            template_params: {
                to_name: data.name,
                to_email: data.email,
                name: data.name,
                email: data.email,
                file_link: fileLink,
            }
        })

        console.log("PAYLOAD : ", payload)

        const emailjsResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Origin': origin,
            },
            body: payload,
        });



        // const result = await emailjsResponse;
        // console.log("Email sent:", emailjsResponse);

        return new Response(JSON.stringify({ success: true, message: "Email sent successfully" }), { status: 200 });
    } catch (err) {
        console.error("Email sending error:", err);
        return new Response(JSON.stringify({ error: "Failed to send email" }), { status: 500 });
    }
}