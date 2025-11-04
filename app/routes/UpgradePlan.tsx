
import { useState } from "react";
import { useNavigate } from "react-router";
import PricingCard from "~/components/PricingCard";

const plans = [
 
  {
    id: "starter",
    name: "Starter",
    price: "฿0",
    limit: "Perfect for trying out",
    features: ["Up to 500 API calls/month",  "Email support", "Core features"],
    buttonText: "Get Started",
  },
  {
    id: "professional",
    name: "Professional",
    price: "฿99",
    limit: "For growing teams",
    features: [
      "Up to 10,000 API calls/month",
      "Priority email & chat support",
      "All core features",
      "Custom integrations",
    ],
    buttonText: "Get Started",
  },
  {
    id: "Extream",
    name: "Extream",
    price: "Custom",
    limit: "For enterprise needs",
    features: [
      "Unlimited API calls",
      "Custom analytics",
      "24/7 dedicated support",
      "Advanced security",
      "SLA guarantee",
      "Custom contract terms",
    ],
    buttonText: "Contact Sales",
  },
]
export default function UpgradePlan() {
  const navigate = useNavigate();
  
    const [currentPlan, setCurrentPlan] = useState("starter");
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Upgrade Your Plan</h1>
        <p className="text-gray-600 mb-12">
          Choose a plan that fits your API usage and unlock more features.
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {plans.map((plan) => (
            <PricingCard plan={{ disabled: plan.id === currentPlan, ...plan }}

             isHighlighted={plan.id === "professional"}
            onButtonClick={() => console.log("buy")} />
        //   <div
        //     key={plan.id}
        //     className={`rounded-2xl bg-white p-8 shadow-sm border border-gray-200 flex flex-col justify-between transition-all hover:shadow-lg ${
        //       plan.disabled ? "opacity-80" : ""
        //     }`}
        //   >
        //     <div>
        //       <h2 className="text-2xl font-semibold mb-2">{plan.name}</h2>
        //       <p className="text-3xl font-bold text-blue-600 mb-4">{plan.price}</p>
        //       <p className="text-sm text-gray-500 mb-6">{plan.limit}</p>

        //       <ul className="space-y-3 text-sm text-gray-600">
        //         {plan.features.map((feature, i) => (
        //           <li key={i} className="flex items-center gap-2">
        //             <GoCheck size={16} className="text-green-500" />
        //             {feature}
        //           </li>
        //         ))}
        //       </ul>
        //     </div>

        //     <button
        //       onClick={() => {
        //         if (!plan.disabled) {
        //           if (plan.id === "business") {
        //             window.location.href = "mailto:sales@yourdomain.com";
        //           } else {
        //             navigate(`/checkout?plan=${plan.id}`);
        //           }
        //         }
        //       }}
        //       disabled={plan.disabled}
        //       className={`mt-8 w-full py-2 rounded-lg text-sm font-medium transition ${
        //         plan.disabled
        //           ? "bg-gray-100 text-gray-400 cursor-not-allowed"
        //           : "bg-blue-600 hover:bg-blue-700 text-white"
        //       }`}
        //     >
        //       {plan.buttonText}
        //     </button>
        //   </div>
        ))}
      </div>

      <div className="max-w-3xl mx-auto mt-16 text-center text-gray-500 text-sm">
        <p>
          All plans include secure authentication, real-time usage monitoring, and the ability to
          cancel anytime. Need a custom plan?{" "}
          <a
            href="mailto:khain.app@gmail.com"
            className="text-black hover:underline font-medium"
          >
            Contact us
          </a>
          .
        </p>
      </div>
    </div>
  );
}
