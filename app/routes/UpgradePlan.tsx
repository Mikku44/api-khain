
import { useState } from "react";
import { useNavigate } from "react-router";
import PricingCard from "~/components/PricingCard";
import type { Route } from "./+types/UpgradePlan";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Upgrade Plan API - Khain.app" },
    { name: "description", content: "Discover endpoints, integrations, and API documentation for Khain.app." },
  ];
}

const plans = [

  {
    id: "starter",
    name: "Starter",
    price: "฿0",
    limit: "Perfect for trying out",
    features: ["Up to 500 API calls/purchase", "Email support", "Core features"],
    buttonText: "Get Started",
  },
  {
    id: "goplan",
    name: "Go Plan",
    price: "฿49",
    limit: "For growing teams",
    features: [
      "Up to 1,000 API calls/purchase",
      "Priority email & chat support",
      "All core features",
      "Custom integrations",
    ],
    buttonText: "Get Started",
  },
  {
    id: "professional",
    name: "Professional",
    price: "฿99",
    limit: "For growing teams",
    features: [
      "Up to 3,000 API calls/purchase",
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
          <PricingCard
            key={plan.id}
            plan={{ disabled: plan.id === currentPlan, ...plan }}
            isHighlighted={plan.id === "goplan"}
            onButtonClick={() => {
              if (plan.id === "Extream") {
                window.open("mailto:khain.app@gmail.com", "_blank");
              } else {
                navigate(`/checkout?plan=${plan.id}`);
              }
            }}
          />
        ))}
      </div>

      <div className="max-w-3xl mx-auto mt-16 text-center text-gray-500 text-sm">
        <p>
          All plans include secure authentication, real-time usage monitoring, and the ability to
          cancel anytime. Need a custom plan?{" "}
          <a
            href="mailto:khain.app@gmail.com"
            target="_blank"
            className="text-black hover:underline font-medium"
          >
            Contact us
          </a>

        </p>
      </div>
    </div>
  );
}
