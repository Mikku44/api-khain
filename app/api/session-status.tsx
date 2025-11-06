
import type { LoaderFunctionArgs } from "react-router";
import { stripe } from "~/libs/stripe/server";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("session_id");

  if (!sessionId) {
    throw Response.json({ error: "Missing session_id" }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return Response.json({
      status: session.status,
      customer_email: session.customer_details?.email ?? null,
    });
  } catch (err) {
    console.error("Stripe session error:", err);
    throw Response.json({ error: "Failed to retrieve session" }, { status: 500 });
  }
}
