
import type { ActionFunctionArgs } from "react-router";
import type { Route } from "./+types/stripe-webhook";
import Stripe from "stripe";
import { sendEmail } from "~/services/emailService";
import { decodeWithSecret } from "~/libs/cypto/services";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "API WEBHOOK - API Khain.app" },
        { name: "description", content: "API KHAIN APP" },
    ];
}

const stripe = new Stripe(process.env.VITE_STRIPE_SECRET_KEY!, {
    apiVersion: "2025-09-30.clover",
});

const endpointSecret = process.env.VITE_STRIPE_WEBHOOK_SECRET!;

export async function action({ request }: ActionFunctionArgs) {
    const rawBody = await request.arrayBuffer();
    const signature = request.headers.get("stripe-signature");

    let event;
    try {
        event = stripe.webhooks.constructEvent(
            Buffer.from(rawBody),
            signature!,
            endpointSecret
        );
    } catch (err: any) {
        console.error("⚠️ Webhook signature verification failed:", err.message);
        return new Response("Invalid signature", { status: 400 });
    }

    switch (event.type) {
        case "payment_intent.succeeded": {
            const paymentIntent = event.data.object as any;
            console.log(`✅ PaymentIntent success: ${paymentIntent.amount}`);
            break;
        }
        case "payment_method.attached": {
            const paymentMethod = event.data.object as any;
            console.log(`💳 PaymentMethod attached: ${paymentMethod.id}`);
            break;
        }
        case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;
            console.log("✅ CHECKOUT COMPLETED");
            console.log("id:", session.id);
            console.log("amount_total:", session.amount_total);
            console.log("currency:", session.currency);
            console.log("customer_email:", session.customer_details?.email);
            console.log("metadata:", session.metadata?.encypt);

            // await sendEmail({
            //     to_name: session.customer_details?.name || "Customer",
            //     to_email: session.customer_details?.email!,
            //     file_link: session.metadata?.file_link || "#",
            // });
            const secretKey = process.env.MY_SECRET_KEY!;

            const fileLink = session.metadata?.encypt
                ? decodeWithSecret(session.metadata.encypt, secretKey)
                : "https://discord.gg/KuMVmcK3cC";

            const payload = JSON.stringify({
                service_id: process.env.EMAILJS_SERVICE_ID!,
                template_id: process.env.EMAILJS_TEMPLATE_ID!,
                user_id: process.env.EMAILJS_PUBLIC_KEY!,
                template_params: {
                    to_name: session.customer_details?.name || "Customer (Muki Gang)",
                    to_email: session.customer_details?.email!,
                    name: session.customer_details?.name || "Customer (Muki Gang)",
                    email: session.customer_details?.email!,
                    file_link: fileLink,
                },
            });

            const emailjsResponse = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: payload,
            });


            break;
        }
        default:
            console.log(`⚠️ Unhandled event type: ${event.type}`);
    }

    return new Response("OK", { status: 200 });
}

export async function loader() {
    return new Response("API WEBHOOK - API Khain.app", { status: 200 });
}
