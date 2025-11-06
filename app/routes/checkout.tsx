import { useSearchParams } from "react-router";
import type { Route } from "./+types/checkout";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_PUBLISHED_KEY);

// --- META ---
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Checkout API - Khain.app" },
    {
      name: "description",
      content:
        "Discover endpoints, integrations, and API documentation for Khain.app.",
    },
  ];
}

// --- LOADER ---
export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const plan = url.searchParams.get("plan") || "starter"; // fallback if missing

  const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      planId: plan, 
    }),
  });

  if (!res.ok) {
    console.error("Checkout session creation failed");
    throw new Response("Failed to load checkout session", { status: 500 });
  }

  const product = await res.json();
  return { clientSecret: product.clientSecret };
}

// --- COMPONENT ---
export default function Checkout({ loaderData }: Route.ComponentProps) {
  const [searchParams] = useSearchParams();
  const plan = searchParams.get("plan");

  return (
    <main
      className="flex flex-col justify-center items-center
      h-screen bg-[var(--bg-primary)] w-full"
    >
      <div id="checkout" className="mt-6 h-full w-full">
        {loaderData?.clientSecret ? (
          <EmbeddedCheckoutProvider
            stripe={stripePromise}
            options={{ clientSecret: loaderData.clientSecret }}
          >
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        ) : (
          <p className="text-red-500">Failed to load checkout session.</p>
        )}
      </div>
    </main>
  );
}
