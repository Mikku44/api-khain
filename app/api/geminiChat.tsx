import type { ActionFunctionArgs } from "react-router";
import { GoogleGenAI } from '@google/genai';

export async function loader() {
    return Response.json({ status: "Gemini Chat API is running" });
}

// Simulate Gemini Chat API call
async function callGeminiChat(message: string) {


    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash-001',
        contents: message,
    });
    // console.log("Gemini Chat response:", response.candidates?.[0]);
    // TODO: Replace with actual Gemini Chat API request
    return response.candidates?.[0] || {error : "No response from Chat" };
}

export async function action({ request }: ActionFunctionArgs) {
    try {
        // Expect JSON body: { message: string }
        const { message } = await request.json();

        if (!message) {
            return Response.json({ error: "Message is required" }, { status: 400 });
        }

        // Call Gemini Chat API
        const result = await callGeminiChat(message);

        return Response.json(result);
    } catch (err) {
        console.error(err);
        return Response.json({ error: "Failed to get response" }, { status: 500 });
    }
}
