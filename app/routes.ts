import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    route("/login", "routes/login.tsx"),
    layout("routes/layout.tsx", [
        index("routes/home.tsx"),
        route("/upgrade","routes/UpgradePlan.tsx"),
        route("/isthisai","routes/isThisAi.tsx"),
        route("/webhook/stripe", "api/stripe-webhook.tsx"),
        route("/webhook/email", "api/email.tsx")
    ]),

    // webresponse
    route("/web/:id","routes/web-response/response.tsx"),

    route("/api/webresponse","api/webresponse.tsx"),
    route("/api/encoder","api/cypto.tsx"),
    route("/api/test","api/test.tsx"),
    route("/api/mailer","api/mailer.tsx"),
    route("/api/fetch","api/fetchv1.tsx"),
    route("/api/gemini_chat","api/geminiChat.tsx"),
    // route("/api/decoder","api/cyptoDe.tsx")

] satisfies RouteConfig;
