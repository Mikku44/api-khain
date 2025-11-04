import type { IWeb } from "~/models/webModel";
import { webResponsesService } from "~/services/webResponseService";
import jwt from "jsonwebtoken"; 

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // should be set in env

export async function action({ request }: { request: Request }) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: Missing or invalid token header" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // ✅ Extract and verify JWT
    const token = authHeader.replace("Bearer ", "").trim();

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid or expired token" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // ✅ Extract user_id from JWT payload
    const user_id = decoded.user_id;
    if (!user_id) {
      return new Response(
        JSON.stringify({ error: "Token missing user_id claim" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // ✅ Parse request body
    const body = (await request.json()) as Partial<IWeb>;
    if (!body.body) {
      return new Response(
        JSON.stringify({ error: "Missing required field: body" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // ✅ Build final payload (user_id from JWT)
    const payload: IWeb = {
      ...body,
      user_id,
    } as IWeb;

    // ✅ Save to Firestore
    const savedWeb = await webResponsesService.createOrUpdateWeb(payload);
    if(savedWeb.error) throw Error(savedWeb.error)
    return new Response(
      JSON.stringify({
        message: "Web response saved successfully",
        data: savedWeb,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in /action:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: (error as Error).message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}



// curl -X POST "http://localhost:3000/api/v1/web-response" \
//   -H "Authorization: Bearer YOUR_ACTIVE_TOKEN" \
//   -H "Content-Type: application/json" \
//   -d '{
//     "body": "<h1>Hello World!</h1>",
//     "name": "Example Web Response"
//   }