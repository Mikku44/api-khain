
import type { ActionFunctionArgs } from "react-router";
import type { Route } from "./+types/stripe-webhook";
import Stripe from "stripe";
import { sendEmail } from "~/services/emailService";
import { decodeWithSecret } from "~/libs/cypto/services";
import { BASE_URL } from "~/repositories/app";

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
            let encrypt = ""
            console.log("✅ CHECKOUT COMPLETED");
            console.log("id:", session.id);
            console.log("amount_total:", session.amount_total);
            console.log("currency:", session.currency);
            console.log("customer_email:", session.customer_details?.email);
            console.log("metadata:", session.metadata?.encypt);

            const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
                expand: ['data.price.product'], // expand product inside price
            });

            lineItems.data.forEach((item) => {
                const product = item.price?.product as Stripe.Product;
                console.log('Product Name:', product.name);
                console.log('Product Metadata:', product.metadata?.encypt);
                encrypt = product.metadata?.encypt
            });

            const secretKey = process.env.MY_SECRET_KEY!;

            const fileLink = encrypt
                ? encrypt
                : "https://discord.gg/KuMVmcK3cC";

            const payload = JSON.stringify({
                name: session.customer_details?.name,
                to_email: session.customer_details?.email!,
                file_link: fileLink,
            });

            console.log(payload)

            const emailjsResponse = await fetch(`${BASE_URL}/api/mailer`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: payload,
            });

            const result = await emailjsResponse.json()

            console.log("RESULT : ",result)

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
