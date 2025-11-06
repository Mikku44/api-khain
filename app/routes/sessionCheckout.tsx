import { redirect, useLoaderData, type LoaderFunctionArgs } from "react-router";
import Loading from "~/components/Loading";
import type { Route } from "./+types/sessionCheckout";
import { userService } from "~/services/userService";
import { useEffect, useState } from "react";
import { stripe } from "~/libs/stripe/server";
import { planMappingNumber } from "~/api/checkout";
import { transactionsService } from "~/services/transactionsService";
import { Timestamp } from "firebase/firestore";
import { toast } from "sonner";


export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Checkout Status API - Khain.app" },
    {
      name: "description",
      content:
        "Discover endpoints, integrations, and API documentation for Khain.app.",
    },
  ];
}


// --- LOADER ---
export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("session_id");

  if (!sessionId) {
    throw Response.json({ error: "Missing session_id" }, { status: 400 });
  }


  // Fetch session status from your backend or Stripe
  const res = await fetch(`${process.env.BASE_URL}/api/session-status?session_id=${sessionId}`);
  if (!res.ok) throw Response.json({ error: "Failed to get session status" }, { status: 500 });

  const data = await res.json();

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  console.log("metadata:", session.metadata?.plan_name);

  // Handle redirect if checkout is still open
  if (data.status === "open") {
    throw redirect("/checkout");
  }




  return Response.json({
    id: session.id,
    status: data.status,
    total: session.amount_total,
    plan: session.metadata?.plan_name,
    
    customerEmail: data.customer_email,
  });
}

// --- COMPONENT ---
export default function SessionCheckout() {
  const { id, status, customerEmail, plan, total } = useLoaderData<typeof loader>();
  const [currentUser, setCurrentUser] = useState<any>(null);


  useEffect(() => {
    // Load user from localStorage
    const user = localStorage.getItem("currentUser");
    if (user) setCurrentUser(JSON.parse(user));
  }, []);

  useEffect(() => {
    if (status === "complete" && currentUser) {


      transactionsService.create({
        amount: total / 100,
        name: plan,
        user_id: currentUser.uid,
        session_id: id,
        created_at: Timestamp.now(),
      }).then((result) => {

        if (result) {
          userService.increaseApiLimit(currentUser.uid, planMappingNumber[plan]);
          toast.success("Purchase successfully!")
        }
      })
    }
  }, [status, currentUser]);


  if (status === "complete") {




    return (
      <section
        id="success"
        className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-8"
      >

        <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-8 max-w-md w-full text-center">
          <img
            src="/sussnowman.png"
            alt="Payment Complete"
            className="w-24 mx-auto mb-6 animate-fadeIn"
          />

          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Payment complete
          </h1>
          <p className="text-gray-600 mb-4">
            Thanks for your purchase! A confirmation email has been sent to{" "}
            <strong>{customerEmail}</strong>.
          </p>

          <p className="text-sm text-gray-500 mb-6">
            If you have any questions, contact us at{" "}
            <a
              href="mailto:khain.app@gmail.com"
              className="text-blue-600 hover:underline"
            >
              khain.app@gmail.com
            </a>
            .
          </p>



          <div className="border-t border-gray-200 my-6"></div>

          <a
            href="/"
            className="inline-flex items-center justify-center rounded-lg bg-black text-white px-5 py-2.5 font-medium hover:bg-gray-800 transition-all duration-200"
          >
            Return to homepage
          </a>

        </div>

        <div className="text-[10px] text-zinc-500 mt-4">Session ID : {id}</div>
      </section>

    );
  }
  return (
    <section
      id="processing"
      className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-8"
    >
      <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-8 max-w-md w-full text-center">
        <img
          src="/sadsnowman.png"
          alt="Processing"
          className="w-24 mx-auto mb-6 animate-fadeIn"
        />

        <div className="flex flex-col items-center gap-4">
          <div className="scale-150">
            <Loading />
          </div>

          <h1 className="text-2xl font-semibold text-gray-900">
            We’re preparing your purchase
          </h1>
          <p className="text-gray-600">Processing your session, please wait...</p>
        </div>

        <div className="border-t border-gray-200 my-6"></div>

        <p className="text-sm text-gray-400">
          This may take a few seconds. Please don’t close this page.
        </p>
      </div>
    </section>

  );
}
