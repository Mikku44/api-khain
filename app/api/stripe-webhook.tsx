
import type { ActionFunctionArgs } from "react-router";
import type { Route } from "./+types/stripe-webhook";
import Stripe from "stripe";

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
      console.log("metadata:", session.metadata);
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
