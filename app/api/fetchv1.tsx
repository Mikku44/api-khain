import { tokenService } from "~/services/tokenService";


export async function action(params: { request: Request }) {
    const authHeader = (params.request).headers.get("Authorization");
    // Simple authentication check (for demonstration purposes)
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return new Response(JSON.stringify({ error: "Unauthorized" }),
            {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
    }

    // authentication with user token 
    const existTokens = await tokenService.getAllTokens();
    // console.log(existTokens);

    const activeToken = existTokens.find(
        (token) => token.token === authHeader.replace("Bearer ", "") && token.status === "active"
    );

    if (!activeToken) {
        // console.log("No active token found for this user.");
        return new Response(JSON.stringify({ error: "Unauthorized, No active token found for your token key." }),
            {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
    }


    // console.log("Fetch API v1 called", authHeader);
    return new Response(JSON.stringify({ message: "Fetch API v1 is working!" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}