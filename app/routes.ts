import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    route("/login", "routes/login.tsx"),
    layout("routes/layout.tsx", [
        index("routes/home.tsx"),
        route("/webhook/stripe", "api/stripe-webhook.tsx"),
        route("/webhook/email", "api/email.tsx")
    ]),
    route("/api/encoder","api/cypto.tsx"),
    // route("/api/decoder","api/cyptoDe.tsx")

] satisfies RouteConfig;
