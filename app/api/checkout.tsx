import { stripe } from "~/libs/stripe/server";
import type { Route } from "./+types/checkout";

const devPlanMapping = {
  starter: "price_1SKcvgCtoGhHqXqWigDGkqFx",
  goplan: "price_1SKcvgCtoGhHqXqWigDGkqFx",
  professional: "price_1SQPFSCtoGhHqXqWjoGHj0Z9",
};

const prodPlanMapping = {
  starter: "price_1SPlp0CtoGhHqXqWWybxEXa3",
  goplan: "price_1SQ78xCtoGhHqXqW69rFgfkc",
  professional: "price_1SRXUyCtoGhHqXqWNFhJsxyF",
};

export const planMapping : any =
  process.env.NODE_ENV === "production" ? prodPlanMapping : devPlanMapping;


export const planMappingNumber: any = {
  "starter": 0,
  "goplan": 100  ,
  "professional": 1000
}



export async function action({ request }: Route.ActionArgs) {
  const data = await request.json();
  console.log("DATA:", data);

  const plan: any = data.planId

  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    line_items: [
      {
        price: planMapping?.[plan],
        quantity: 1,
      },
    ],
    mode: "payment",
    return_url: `${process.env.BASE_URL}/return?session_id={CHECKOUT_SESSION_ID}`,
    metadata: {
      plan_name: plan,
    },
  });

  return Response.json({ clientSecret: session.client_secret });
}
