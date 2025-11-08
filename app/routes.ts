import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    route("/login", "routes/login.tsx"),
    layout("routes/layout.tsx", [
        index("routes/home.tsx"),
        route("/upgrade", "routes/UpgradePlan.tsx"),
        route("/payments", "routes/payments.tsx"),
        route("/isthisai", "routes/isThisAi.tsx"),
        route("/web-list", "routes/web-list.tsx"),
        route("/docs", "routes/docs/docs.tsx"),

    ]),
    route("/checkout", "routes/checkout.tsx"),
    route("/return", "routes/sessionCheckout.tsx"),

    // webresponse
    route("/web/:id", "routes/web-response/response.tsx"),

    route("/webhook/stripe", "api/stripe-webhook.tsx"),
    route("/webhook/email", "api/email.tsx"),

    route("/api/v1/web-response", "api/webresponse.tsx"),
    route("/api/encoder", "api/cypto.tsx"),
    route("/api/test", "api/test.tsx"),
    route("/api/checkout", "api/checkout.tsx"),
    route("/api/session-status", "api/session-status.tsx"),
    route("/api/mailer", "api/mailer.tsx"),
    route("/api/fetch", "api/fetchv1.tsx"),
    route("/api/gemini_chat", "api/geminiChat.tsx"),
    // route("/api/decoder","api/cyptoDe.tsx")

] satisfies RouteConfig;
