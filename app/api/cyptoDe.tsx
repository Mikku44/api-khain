import type { LoaderFunctionArgs } from "react-router";
import { decodeWithSecret } from "~/libs/cypto/services";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const value = url.searchParams.get("value");
  const secretKey = process.env.MY_SECRET_KEY!;

  if (!value) {
    return new Response(
      JSON.stringify({ error: "Missing value parameter" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  let encoded: string;
  try {
    encoded = decodeWithSecret(value, secretKey);
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Failed to encode value" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  return new Response(JSON.stringify({ encoded }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
